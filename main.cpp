#include <iostream>
#include <fstream>
#include <string>

using namespace std;

struct CacheItem {
    int key;
    int value;
};

template<typename T>
struct DoubleNode {
    T data;
    DoubleNode<T> *next;
    DoubleNode<T> *prev;
    DoubleNode(T data) : data(data), next(nullptr), prev(nullptr) {}
};

template<typename T>
struct DoubleLinkedList {
    DoubleNode<T> *head = nullptr;
    DoubleNode<T> *tail = nullptr;
    int n = 0;

    void push_front(T data) {
        DoubleNode<T> *new_node = new DoubleNode<T>(data);
        if (head == nullptr) {
            head = tail = new_node;
        } else {
            new_node->next = head;
            head->prev = new_node;
            head = new_node;
        }
        n++;
    }

    void remove_node(DoubleNode<T> *node) {
        if (!node) return;
        if (node->prev) node->prev->next = node->next;
        else head = node->next;

        if (node->next) node->next->prev = node->prev;
        else tail = node->prev;

        n--;
    }

    void pop_back() {
        if (tail) {
            DoubleNode<T>* temp = tail;
            remove_node(tail);
            delete temp;
        }
    }
};

struct HashNode {
    HashNode *next;
    int key;
    DoubleNode<CacheItem> *node_ptr;

    HashNode(int _key, DoubleNode<CacheItem> *_node_ptr){
        next = nullptr;
        key = _key;
        node_ptr = _node_ptr;
    }
};

struct HashTable {
    int m;
    HashNode **A;

    HashTable(int _m) {
        m = _m;
        A = new HashNode*[m];
        for (int i = 0; i < m; i++) A[i] = nullptr;
    }

    int hash(int k) { return k % m; }

    void insert(int k, DoubleNode<CacheItem> *node_ptr) {
        erase(k);
        HashNode *new_node = new HashNode(k, node_ptr);
        int p = hash(k);
        new_node->next = A[p];
        A[p] = new_node;
    }

    DoubleNode<CacheItem>* search(int k) {
        int p = hash(k);
        HashNode *temp = A[p];
        while(temp != nullptr){
            if(temp->key == k) return temp->node_ptr;
            temp = temp->next;
        }
        return nullptr;
    }

    void erase(int k) {
        int p = hash(k);
        HashNode *temp = A[p];
        HashNode *prev = nullptr;
        while(temp != nullptr){
            if(temp->key == k){
                if(prev == nullptr) A[p] = temp->next;
                else prev->next = temp->next;
                delete temp;
                return;
            }
            prev = temp;
            temp = temp->next;
        }
    }
};

class LRUCache {
    int capacity;
    DoubleLinkedList<CacheItem> list;
    HashTable map;
    ofstream log_file;
    bool first_event;

    void log_event(string action, int key, int value, string desc) {
        if (!first_event) log_file << ",\n";
        log_file << "  {\n";
        log_file << "    \"action\": \"" << action << "\",\n";
        log_file << "    \"key\": " << key << ",\n";
        log_file << "    \"value\": " << value << ",\n";
        log_file << "    \"description\": \"" << desc << "\"\n";
        log_file << "  }";
        first_event = false;
    }

public:
    LRUCache(int cap) : capacity(cap), map(cap * 2) {
        log_file.open("lru_animation_events.json");
        log_file << "[\n";
        first_event = true;
    }

    ~LRUCache() {
        log_file << "\n]\n";
        log_file.close();
    }

    int get(int key) {
        DoubleNode<CacheItem>* node = map.search(key);
        if (!node) {
            log_event("GET_MISS", key, -1, "Key not found");
            return -1;
        }

        CacheItem item = node->data;
        list.remove_node(node);
        delete node;
        list.push_front(item);
        map.insert(key, list.head);

        log_event("GET_HIT", key, item.value, "Key found. Moved to MRU (front).");
        return item.value;
    }

    void put(int key, int value) {
        DoubleNode<CacheItem>* node = map.search(key);

        if (node) {
            list.remove_node(node);
            delete node;
            list.push_front({key, value});
            map.insert(key, list.head);
            log_event("PUT_UPDATE", key, value, "Key updated and moved to MRU.");
        } else {
            if (list.n == capacity) {
                int lru_key = list.tail->data.key;
                map.erase(lru_key);
                list.pop_back();
                log_event("EVICT", lru_key, -1, "Capacity reached. Evicted LRU from tail.");
            }
            list.push_front({key, value});
            map.insert(key, list.head);
            log_event("PUT_INSERT", key, value, "New key inserted at MRU.");
        }
    }
};

int main() {
    LRUCache cache(3);

    cache.put(1, 100);
    cache.put(2, 200);
    cache.put(3, 300);
    cache.get(1);
    cache.put(4, 400);
    cache.get(2);

    cout << "Archivo lru_animation_events.json generado" << endl;
    return 0;
}