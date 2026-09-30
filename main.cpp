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

    ~DoubleLinkedList() {
        DoubleNode<T> *curr = head;
        while (curr) {
            DoubleNode<T> *next_node = curr->next;
            delete curr;
            curr = next_node;
        }
    }

    DoubleNode<T>* push_front(T data) {
        DoubleNode<T> *new_node = new DoubleNode<T>(data);
        if (head == nullptr) {
            head = tail = new_node;
        } else {
            new_node->next = head;
            head->prev = new_node;
            head = new_node;
        }
        n++;
        return new_node;
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

    void dump_json(ostream& os) const {
        os << "[\n";
        DoubleNode<T>* curr = head;
        while (curr) {
            os << "        {";
            os << "\"key\": " << curr->data.key << ", ";
            os << "\"value\": " << curr->data.value << ", ";
            os << "\"is_head\": " << (curr == head ? "true" : "false") << ", ";
            os << "\"is_tail\": " << (curr == tail ? "true" : "false") << ", ";
            os << "\"prev_key\": " << (curr->prev ? to_string(curr->prev->data.key) : "null") << ", ";
            os << "\"next_key\": " << (curr->next ? to_string(curr->next->data.key) : "null");
            os << "}";
            if (curr->next) os << ",";
            os << "\n";
            curr = curr->next;
        }
        os << "      ]";
    }
};

struct HashNode {
    HashNode *next;
    int key;
    DoubleNode<CacheItem> *node_ptr;

    HashNode(int _key, DoubleNode<CacheItem> *_node_ptr) {
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

    ~HashTable() {
        for (int i = 0; i < m; i++) {
            HashNode *curr = A[i];
            while (curr) {
                HashNode *tmp = curr->next;
                delete curr;
                curr = tmp;
            }
        }
        delete[] A;
    }

    int hash(int k) const { 
        int h = k % m; 
        return h < 0 ? h + m : h;
    }

    void insert(int k, DoubleNode<CacheItem> *node_ptr) {
        erase(k);
        HashNode *new_node = new HashNode(k, node_ptr);
        int p = hash(k);
        new_node->next = A[p];
        A[p] = new_node;
    }

    DoubleNode<CacheItem>* search(int k) const {
        int p = hash(k);
        HashNode *temp = A[p];
        while (temp != nullptr) {
            if (temp->key == k) return temp->node_ptr;
            temp = temp->next;
        }
        return nullptr;
    }

    void erase(int k) {
        int p = hash(k);
        HashNode *temp = A[p];
        HashNode *prev = nullptr;
        while (temp != nullptr) {
            if (temp->key == k) {
                if (prev == nullptr) A[p] = temp->next;
                else prev->next = temp->next;
                delete temp;
                return;
            }
            prev = temp;
            temp = temp->next;
        }
    }

    void dump_json(ostream& os) const {
        os << "[\n";
        for (int i = 0; i < m; i++) {
            os << "        {\"bucket\": " << i << ", \"entries\": [";
            HashNode* curr = A[i];
            bool first = true;
            while (curr) {
                if (!first) os << ", ";
                os << "{\"key\": " << curr->key << ", \"points_to_key\": " << curr->node_ptr->data.key << "}";
                first = false;
                curr = curr->next;
            }
            os << "]}";
            if (i < m - 1) os << ",";
            os << "\n";
        }
        os << "      ]";
    }
};

class LRUCache {
    int capacity;
    DoubleLinkedList<CacheItem> list;
    HashTable map;
    ofstream log_file;
    bool first_event;
    int step_counter;

    void log_event(string action, int key, int value, int target_bucket, int evicted_key,
                   string desc, string complexity_note, bool is_edge_case, string edge_case_type) {
        if (!first_event) log_file << ",\n";
        log_file << "  {\n";
        log_file << "    \"step\": " << step_counter++ << ",\n";
        log_file << "    \"action\": \"" << action << "\",\n";
        log_file << "    \"key\": " << key << ",\n";
        log_file << "    \"value\": " << value << ",\n";
        log_file << "    \"target_bucket\": " << (target_bucket >= 0 ? to_string(target_bucket) : "null") << ",\n";
        log_file << "    \"evicted_key\": " << (evicted_key >= 0 ? to_string(evicted_key) : "null") << ",\n";
        log_file << "    \"description\": \"" << desc << "\",\n";
        log_file << "    \"complexity_note\": \"" << complexity_note << "\",\n";
        log_file << "    \"is_edge_case\": " << (is_edge_case ? "true" : "false") << ",\n";
        log_file << "    \"edge_case_type\": \"" << edge_case_type << "\",\n";
        log_file << "    \"state\": {\n";
        log_file << "      \"capacity\": " << capacity << ",\n";
        log_file << "      \"size\": " << list.n << ",\n";
        log_file << "      \"head_key\": " << (list.head ? to_string(list.head->data.key) : "null") << ",\n";
        log_file << "      \"tail_key\": " << (list.tail ? to_string(list.tail->data.key) : "null") << ",\n";
        log_file << "      \"list\": ";
        list.dump_json(log_file);
        log_file << ",\n";
        log_file << "      \"hash_table\": ";
        map.dump_json(log_file);
        log_file << "\n";
        log_file << "    }\n";
        log_file << "  }";
        first_event = false;
        log_file.flush();
    }

public:
    LRUCache(int cap, const string& output_filename = "lru_animation_events.json") 
        : capacity(cap), map(cap * 2), first_event(true), step_counter(0) {
        log_file.open(output_filename);
        log_file << "[\n";
        
        // Log Initial Empty State
        log_event("INIT", -1, -1, -1, -1, 
                  "LRU Cache inicializada con capacidad " + to_string(cap) + " y Hash Table con " + to_string(cap * 2) + " buckets.",
                  "O(1): Inicializacion de punteros de lista (head=nullptr, tail=nullptr) y tabla hash enlazada.",
                  true, "ESTRUCTURA_VACIA");
    }

    ~LRUCache() {
        log_file << "\n]\n";
        log_file.close();
    }

    int get(int key) {
        int b = map.hash(key);
        DoubleNode<CacheItem>* node = map.search(key);
        if (!node) {
            log_event("GET_MISS", key, -1, b, -1,
                      "GET(" + to_string(key) + "): Cache Miss. La clave no existe en la Hash Table ni en la Lista.",
                      "O(1): Busqueda en el bucket " + to_string(b) + " de la Hash Table retorna nullptr. No se altera la lista.",
                      true, "ELEMENTO_NO_ENCONTRADO");
            return -1;
        }

        CacheItem item = node->data;

        // Si ya está en la cabeza (MRU), no requiere mover punteros
        if (node == list.head) {
            log_event("GET_HIT", key, item.value, b, -1,
                      "GET(" + to_string(key) + "): Cache Hit. El nodo ya se encuentra en la cabeza (MRU). Valor: " + to_string(item.value),
                      "O(1): Acceso directo mediante el puntero almacenado en la Hash Table. No se requiere desconexion.",
                      false, "");
            return item.value;
        }

        // Desconectar nodo en O(1) usando punteros prev y next
        list.remove_node(node);
        delete node;

        // Insertar al frente en O(1)
        list.push_front(item);

        // Actualizar referencia en la Hash Table
        map.insert(key, list.head);

        log_event("GET_HIT", key, item.value, b, -1,
                  "GET(" + to_string(key) + "): Cache Hit! Clave encontrada. Se traslada el nodo a la cabeza (MRU).",
                  "O(1): Hash Table localiza nodo en O(1). La lista doblemente enlazada desconecta y reubica en cabeza en O(1) sin recorrer.",
                  false, "");
        return item.value;
    }

    void put(int key, int value) {
        int b = map.hash(key);
        DoubleNode<CacheItem>* node = map.search(key);

        if (node) {
            // Actualización de clave existente
            list.remove_node(node);
            delete node;
            list.push_front({key, value});
            map.insert(key, list.head);
            log_event("PUT_UPDATE", key, value, b, -1,
                      "PUT(" + to_string(key) + ", " + to_string(value) + "): Clave ya existe. Valor actualizado y promovido a MRU.",
                      "O(1): El nodo existente se extrae en O(1), se inserta al frente con el nuevo valor y se actualiza el puntero en la Hash Table.",
                      true, "ACTUALIZACION_CLAVE_EXISTENTE");
        } else {
            int evicted_key = -1;
            // Capacidad máxima alcanzada: Desalojo (Eviction)
            if (list.n == capacity) {
                evicted_key = list.tail->data.key;
                int evict_b = map.hash(evicted_key);
                map.erase(evicted_key);
                list.pop_back();
                log_event("EVICT", evicted_key, -1, evict_b, evicted_key,
                          "EVICTION: Capacidad maxima (" + to_string(capacity) + ") alcanzada. Se expira el elemento LRU (clave " + to_string(evicted_key) + ") de la cola.",
                          "O(1): tail->data.key identifica el nodo LRU al instante. tail se elimina en O(1) y se borra de la Hash Table en O(1).",
                          true, "DESALOJO_CAPACIDAD_MAXIMA");
            }

            // Inserción del nuevo nodo al frente (MRU)
            list.push_front({key, value});
            map.insert(key, list.head);

            bool is_first = (list.n == 1);
            log_event("PUT_INSERT", key, value, b, -1,
                      "PUT(" + to_string(key) + ", " + to_string(value) + "): Nueva clave insertada en la cabeza (MRU) e indexada en bucket " + to_string(b) + ".",
                      "O(1): Insercion al frente de la lista doblemente enlazada e insercion en Hash Table.",
                      is_first, is_first ? "UN_SOLO_ELEMENTO" : "");
        }
    }
};

int main() {
    cout << "=================================================" << endl;
    cout << "  Simulacion Real LRU Cache - AED Proyecto 1     " << endl;
    cout << "=================================================" << endl;

    // Instancia con capacidad 3 para demonstrar claramente todos los casos borde y operaciones
    LRUCache cache(3, "lru_animation_events.json");

    // 1. Inserción inicial (Caso borde: de vacio a 1 elemento)
    cout << "[Paso 1] PUT(1, 100)" << endl;
    cache.put(1, 100);

    // 2. Inserciones hasta completar capacidad
    cout << "[Paso 2] PUT(2, 200)" << endl;
    cache.put(2, 200);

    cout << "[Paso 3] PUT(3, 300) -> Capacidad llena (3/3)" << endl;
    cache.put(3, 300);

    // 3. GET HIT: Acceso a un nodo intermedio/cola (clave 1). Sube a MRU (Head)
    cout << "[Paso 4] GET(1) -> Cache Hit (pasa a MRU)" << endl;
    cache.get(1);

    // 4. GET MISS: Caso borde de búsqueda fallida (clave inexistente)
    cout << "[Paso 5] GET(99) -> Cache Miss (clave inexistente)" << endl;
    cache.get(99);

    // 5. PUT UPDATE: Caso borde de actualización de valor de una clave existente
    cout << "[Paso 6] PUT(3, 350) -> Actualizacion in-place y refresh a MRU" << endl;
    cache.put(3, 350);

    // 6. EVICTION: Caso borde crítico. Capacidad llena, inserción de nueva clave (4) desaloja a la cola (LRU = clave 2)
    cout << "[Paso 7] PUT(4, 400) -> Eviction de clave 2 (LRU) e insercion de 4" << endl;
    cache.put(4, 400);

    // 7. GET MISS del elemento desalojado para verificar consistencia
    cout << "[Paso 8] GET(2) -> Cache Miss (confirmar que fue desalojado)" << endl;
    cache.get(2);

    // 8. GET HIT en nodo de cabeza (MRU)
    cout << "[Paso 9] GET(4) -> Cache Hit en la cabeza" << endl;
    cache.get(4);

    // 9. Nueva inserción provocando segundo desalojo (ahora desaloja al siguiente LRU = clave 1)
    cout << "[Paso 10] PUT(5, 500) -> Eviction de clave 1 e insercion de 5" << endl;
    cache.put(5, 500);

    // 10. GET HIT final
    cout << "[Paso 11] GET(3) -> Cache Hit" << endl;
    cache.get(3);

    cout << "\n-> Archivo 'lru_animation_events.json' generado con exito con todos los snapshots." << endl;
    return 0;
}