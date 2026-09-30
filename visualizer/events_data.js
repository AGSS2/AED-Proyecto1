// Eventos generados por C++ (AED-Proyecto1/main.cpp)
const LRU_EVENTS_DATA = [
  {
    "step": 0,
    "action": "INIT",
    "key": -1,
    "value": -1,
    "target_bucket": null,
    "evicted_key": null,
    "description": "LRU Cache inicializada con capacidad 3 y Hash Table con 6 buckets.",
    "complexity_note": "O(1): Inicializacion de punteros de lista (head=nullptr, tail=nullptr) y tabla hash enlazada.",
    "is_edge_case": true,
    "edge_case_type": "ESTRUCTURA_VACIA",
    "state": {
      "capacity": 3,
      "size": 0,
      "head_key": null,
      "tail_key": null,
      "list": [],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": []
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": []
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 1,
    "action": "PUT_INSERT",
    "key": 1,
    "value": 100,
    "target_bucket": 1,
    "evicted_key": null,
    "description": "PUT(1, 100): Nueva clave insertada en la cabeza (MRU) e indexada en bucket 1.",
    "complexity_note": "O(1): Insercion al frente de la lista doblemente enlazada e insercion en Hash Table.",
    "is_edge_case": true,
    "edge_case_type": "UN_SOLO_ELEMENTO",
    "state": {
      "capacity": 3,
      "size": 1,
      "head_key": 1,
      "tail_key": 1,
      "list": [
        {
          "key": 1,
          "value": 100,
          "is_head": true,
          "is_tail": true,
          "prev_key": null,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": []
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 2,
    "action": "PUT_INSERT",
    "key": 2,
    "value": 200,
    "target_bucket": 2,
    "evicted_key": null,
    "description": "PUT(2, 200): Nueva clave insertada en la cabeza (MRU) e indexada en bucket 2.",
    "complexity_note": "O(1): Insercion al frente de la lista doblemente enlazada e insercion en Hash Table.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 2,
      "head_key": 2,
      "tail_key": 1,
      "list": [
        {
          "key": 2,
          "value": 200,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": true,
          "prev_key": 2,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": [
            {
              "key": 2,
              "points_to_key": 2
            }
          ]
        },
        {
          "bucket": 3,
          "entries": []
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 3,
    "action": "PUT_INSERT",
    "key": 3,
    "value": 300,
    "target_bucket": 3,
    "evicted_key": null,
    "description": "PUT(3, 300): Nueva clave insertada en la cabeza (MRU) e indexada en bucket 3.",
    "complexity_note": "O(1): Insercion al frente de la lista doblemente enlazada e insercion en Hash Table.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 3,
      "tail_key": 1,
      "list": [
        {
          "key": 3,
          "value": 300,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 2
        },
        {
          "key": 2,
          "value": 200,
          "is_head": false,
          "is_tail": false,
          "prev_key": 3,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": true,
          "prev_key": 2,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": [
            {
              "key": 2,
              "points_to_key": 2
            }
          ]
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 4,
    "action": "GET_HIT",
    "key": 1,
    "value": 100,
    "target_bucket": 1,
    "evicted_key": null,
    "description": "GET(1): Cache Hit! Clave encontrada. Se traslada el nodo a la cabeza (MRU).",
    "complexity_note": "O(1): Hash Table localiza nodo en O(1). La lista doblemente enlazada desconecta y reubica en cabeza en O(1) sin recorrer.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 1,
      "tail_key": 2,
      "list": [
        {
          "key": 1,
          "value": 100,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 300,
          "is_head": false,
          "is_tail": false,
          "prev_key": 1,
          "next_key": 2
        },
        {
          "key": 2,
          "value": 200,
          "is_head": false,
          "is_tail": true,
          "prev_key": 3,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": [
            {
              "key": 2,
              "points_to_key": 2
            }
          ]
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 5,
    "action": "GET_MISS",
    "key": 99,
    "value": -1,
    "target_bucket": 3,
    "evicted_key": null,
    "description": "GET(99): Cache Miss. La clave no existe en la Hash Table ni en la Lista.",
    "complexity_note": "O(1): Busqueda en el bucket 3 de la Hash Table retorna nullptr. No se altera la lista.",
    "is_edge_case": true,
    "edge_case_type": "ELEMENTO_NO_ENCONTRADO",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 1,
      "tail_key": 2,
      "list": [
        {
          "key": 1,
          "value": 100,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 300,
          "is_head": false,
          "is_tail": false,
          "prev_key": 1,
          "next_key": 2
        },
        {
          "key": 2,
          "value": 200,
          "is_head": false,
          "is_tail": true,
          "prev_key": 3,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": [
            {
              "key": 2,
              "points_to_key": 2
            }
          ]
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 6,
    "action": "PUT_UPDATE",
    "key": 3,
    "value": 350,
    "target_bucket": 3,
    "evicted_key": null,
    "description": "PUT(3, 350): Clave ya existe. Valor actualizado y promovido a MRU.",
    "complexity_note": "O(1): El nodo existente se extrae en O(1), se inserta al frente con el nuevo valor y se actualiza el puntero en la Hash Table.",
    "is_edge_case": true,
    "edge_case_type": "ACTUALIZACION_CLAVE_EXISTENTE",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 3,
      "tail_key": 2,
      "list": [
        {
          "key": 3,
          "value": 350,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": false,
          "prev_key": 3,
          "next_key": 2
        },
        {
          "key": 2,
          "value": 200,
          "is_head": false,
          "is_tail": true,
          "prev_key": 1,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": [
            {
              "key": 2,
              "points_to_key": 2
            }
          ]
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 7,
    "action": "EVICT",
    "key": 2,
    "value": -1,
    "target_bucket": 2,
    "evicted_key": 2,
    "description": "EVICTION: Capacidad maxima (3) alcanzada. Se expira el elemento LRU (clave 2) de la cola.",
    "complexity_note": "O(1): tail->data.key identifica el nodo LRU al instante. tail se elimina en O(1) y se borra de la Hash Table en O(1).",
    "is_edge_case": true,
    "edge_case_type": "DESALOJO_CAPACIDAD_MAXIMA",
    "state": {
      "capacity": 3,
      "size": 2,
      "head_key": 3,
      "tail_key": 1,
      "list": [
        {
          "key": 3,
          "value": 350,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": true,
          "prev_key": 3,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": []
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 8,
    "action": "PUT_INSERT",
    "key": 4,
    "value": 400,
    "target_bucket": 4,
    "evicted_key": null,
    "description": "PUT(4, 400): Nueva clave insertada en la cabeza (MRU) e indexada en bucket 4.",
    "complexity_note": "O(1): Insercion al frente de la lista doblemente enlazada e insercion en Hash Table.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 4,
      "tail_key": 1,
      "list": [
        {
          "key": 4,
          "value": 400,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 350,
          "is_head": false,
          "is_tail": false,
          "prev_key": 4,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": true,
          "prev_key": 3,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": [
            {
              "key": 4,
              "points_to_key": 4
            }
          ]
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 9,
    "action": "GET_MISS",
    "key": 2,
    "value": -1,
    "target_bucket": 2,
    "evicted_key": null,
    "description": "GET(2): Cache Miss. La clave no existe en la Hash Table ni en la Lista.",
    "complexity_note": "O(1): Busqueda en el bucket 2 de la Hash Table retorna nullptr. No se altera la lista.",
    "is_edge_case": true,
    "edge_case_type": "ELEMENTO_NO_ENCONTRADO",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 4,
      "tail_key": 1,
      "list": [
        {
          "key": 4,
          "value": 400,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 350,
          "is_head": false,
          "is_tail": false,
          "prev_key": 4,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": true,
          "prev_key": 3,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": [
            {
              "key": 4,
              "points_to_key": 4
            }
          ]
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 10,
    "action": "GET_HIT",
    "key": 4,
    "value": 400,
    "target_bucket": 4,
    "evicted_key": null,
    "description": "GET(4): Cache Hit. El nodo ya se encuentra en la cabeza (MRU). Valor: 400",
    "complexity_note": "O(1): Acceso directo mediante el puntero almacenado en la Hash Table. No se requiere desconexion.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 4,
      "tail_key": 1,
      "list": [
        {
          "key": 4,
          "value": 400,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 350,
          "is_head": false,
          "is_tail": false,
          "prev_key": 4,
          "next_key": 1
        },
        {
          "key": 1,
          "value": 100,
          "is_head": false,
          "is_tail": true,
          "prev_key": 3,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": [
            {
              "key": 1,
              "points_to_key": 1
            }
          ]
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": [
            {
              "key": 4,
              "points_to_key": 4
            }
          ]
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 11,
    "action": "EVICT",
    "key": 1,
    "value": -1,
    "target_bucket": 1,
    "evicted_key": 1,
    "description": "EVICTION: Capacidad maxima (3) alcanzada. Se expira el elemento LRU (clave 1) de la cola.",
    "complexity_note": "O(1): tail->data.key identifica el nodo LRU al instante. tail se elimina en O(1) y se borra de la Hash Table en O(1).",
    "is_edge_case": true,
    "edge_case_type": "DESALOJO_CAPACIDAD_MAXIMA",
    "state": {
      "capacity": 3,
      "size": 2,
      "head_key": 4,
      "tail_key": 3,
      "list": [
        {
          "key": 4,
          "value": 400,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 350,
          "is_head": false,
          "is_tail": true,
          "prev_key": 4,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": []
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": [
            {
              "key": 4,
              "points_to_key": 4
            }
          ]
        },
        {
          "bucket": 5,
          "entries": []
        }
      ]
    }
  },
  {
    "step": 12,
    "action": "PUT_INSERT",
    "key": 5,
    "value": 500,
    "target_bucket": 5,
    "evicted_key": null,
    "description": "PUT(5, 500): Nueva clave insertada en la cabeza (MRU) e indexada en bucket 5.",
    "complexity_note": "O(1): Insercion al frente de la lista doblemente enlazada e insercion en Hash Table.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 5,
      "tail_key": 3,
      "list": [
        {
          "key": 5,
          "value": 500,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 4
        },
        {
          "key": 4,
          "value": 400,
          "is_head": false,
          "is_tail": false,
          "prev_key": 5,
          "next_key": 3
        },
        {
          "key": 3,
          "value": 350,
          "is_head": false,
          "is_tail": true,
          "prev_key": 4,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": []
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": [
            {
              "key": 4,
              "points_to_key": 4
            }
          ]
        },
        {
          "bucket": 5,
          "entries": [
            {
              "key": 5,
              "points_to_key": 5
            }
          ]
        }
      ]
    }
  },
  {
    "step": 13,
    "action": "GET_HIT",
    "key": 3,
    "value": 350,
    "target_bucket": 3,
    "evicted_key": null,
    "description": "GET(3): Cache Hit! Clave encontrada. Se traslada el nodo a la cabeza (MRU).",
    "complexity_note": "O(1): Hash Table localiza nodo en O(1). La lista doblemente enlazada desconecta y reubica en cabeza en O(1) sin recorrer.",
    "is_edge_case": false,
    "edge_case_type": "",
    "state": {
      "capacity": 3,
      "size": 3,
      "head_key": 3,
      "tail_key": 4,
      "list": [
        {
          "key": 3,
          "value": 350,
          "is_head": true,
          "is_tail": false,
          "prev_key": null,
          "next_key": 5
        },
        {
          "key": 5,
          "value": 500,
          "is_head": false,
          "is_tail": false,
          "prev_key": 3,
          "next_key": 4
        },
        {
          "key": 4,
          "value": 400,
          "is_head": false,
          "is_tail": true,
          "prev_key": 5,
          "next_key": null
        }
      ],
      "hash_table": [
        {
          "bucket": 0,
          "entries": []
        },
        {
          "bucket": 1,
          "entries": []
        },
        {
          "bucket": 2,
          "entries": []
        },
        {
          "bucket": 3,
          "entries": [
            {
              "key": 3,
              "points_to_key": 3
            }
          ]
        },
        {
          "bucket": 4,
          "entries": [
            {
              "key": 4,
              "points_to_key": 4
            }
          ]
        },
        {
          "bucket": 5,
          "entries": [
            {
              "key": 5,
              "points_to_key": 5
            }
          ]
        }
      ]
    }
  }
];
