-- Catálogo inmutable compartido con content/valbruma.v1.json.
insert into tcards.content(version,definition) values (1,$region$
{
  "version": 1,
  "initial": {
    "node": "square",
    "hp": 10,
    "gold": 4,
    "quest": 0,
    "foe": 0,
    "guard": 0,
    "blade": 0,
    "equipped": 0,
    "potions": 1
  },
  "cards": {
    "square": {
      "kind": "place",
      "title": "Plaza de las campanas",
      "body": "Al pie de la torre, seis calles cortan la niebla. De la posada llega olor a leña y pan.",
      "art": "village",
      "actions": [
        {
          "slot": "farLeft",
          "id": "visit_chapel",
          "label": "Capilla",
          "to": "chapel"
        },
        {
          "slot": "left",
          "id": "visit_inn",
          "label": "Posada",
          "to": "inn"
        },
        {
          "slot": "up",
          "id": "follow_road",
          "label": "Camino",
          "to": "road"
        },
        {
          "slot": "right",
          "id": "visit_market",
          "label": "Mercado",
          "to": "market"
        },
        {
          "slot": "farRight",
          "id": "visit_gate",
          "label": "Muralla",
          "to": "gate"
        },
        {
          "slot": "down",
          "id": "visit_well",
          "label": "Pozo",
          "to": "well"
        }
      ]
    },
    "inn": {
      "kind": "place",
      "title": "La Liebre de Cobre",
      "body": "Una llave de latón cuelga junto al hogar. El posadero cuenta las campanadas con la mirada fija en la puerta.",
      "art": "inn",
      "actions": [
        {
          "slot": "left",
          "id": "speak",
          "label": "Conversar",
          "to": "keeper"
        },
        {
          "slot": "right",
          "id": "rest",
          "label": "Descansar",
          "to": "inn",
          "set": {
            "hp": 10
          },
          "note": "El descanso te devuelve toda la vida."
        },
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "square"
        }
      ]
    },
    "keeper": {
      "kind": "npc",
      "title": "Ivo, el posadero",
      "body": "«Hay una mesa puesta para alguien que no ha llegado. ¿Vienes del camino viejo?»",
      "art": "keeper",
      "actions": [
        {
          "slot": "left",
          "id": "ask",
          "label": "Preguntar",
          "to": "request",
          "when": {
            "quest": [
              0,
              0
            ]
          }
        },
        {
          "slot": "up",
          "id": "rumor",
          "label": "Escuchar",
          "to": "rumor"
        },
        {
          "slot": "right",
          "id": "report",
          "label": "Dar noticias",
          "to": "inn",
          "when": {
            "quest": [
              2,
              2
            ]
          },
          "add": {
            "gold": 8
          },
          "set": {
            "quest": 3
          },
          "note": "Ivo vuelve a encender el farol. Recibes ocho monedas de oro."
        },
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "inn"
        }
      ]
    },
    "rumor": {
      "kind": "npc",
      "title": "El último farol",
      "body": "«La mensajera ata cintas azules en los fresnos. Si encuentras una, mira en qué dirección apunta el nudo.»",
      "art": "keeper",
      "actions": [
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "keeper"
        }
      ]
    },
    "request": {
      "kind": "npc",
      "title": "Una silla vacía",
      "body": "«Mara llevaba el correo del norte. Busca su carro más allá del puente. Ocho monedas por traerme noticias.»",
      "art": "keeper",
      "actions": [
        {
          "slot": "left",
          "id": "defer",
          "label": "Aplazar",
          "to": "inn"
        },
        {
          "slot": "right",
          "id": "accept",
          "label": "Aceptar",
          "to": "inn",
          "set": {
            "quest": 1
          },
          "note": "Encargo aceptado. Busca el carro en el camino viejo."
        }
      ]
    },
    "road": {
      "kind": "place",
      "title": "Camino de los fresnos",
      "body": "Las ruedas han abierto dos surcos en el barro. Una cinta azul asoma entre las ramas junto al puente.",
      "art": "forest",
      "actions": [
        {
          "slot": "up",
          "id": "investigate",
          "label": "Seguir huellas",
          "to": "enemy",
          "when": {
            "quest": [
              1,
              1
            ]
          },
          "set": {
            "foe": 6,
            "guard": 0
          },
          "note": "Un lobo ceniciento protege el carro volcado."
        },
        {
          "slot": "left",
          "id": "cross",
          "label": "Cruzar puente",
          "to": "bridge"
        },
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "square"
        }
      ]
    },
    "bridge": {
      "kind": "place",
      "title": "Puente del aliso",
      "body": "El agua golpea los pilares. En la orilla opuesta el sendero se pierde entre los juncos.",
      "art": "forest",
      "actions": [
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "road"
        }
      ]
    },
    "enemy": {
      "kind": "enemy",
      "title": "Lobo ceniciento",
      "body": "El lobo rodea el carro, atento a tu mano. Puedes parar su embestida y responder con un golpe más fuerte.",
      "art": "wolf",
      "actions": [
        {
          "slot": "right",
          "id": "strike",
          "label": "Atacar",
          "to": "enemy",
          "when": {
            "guard": [
              0,
              0
            ],
            "equipped": [
              0,
              0
            ]
          },
          "add": {
            "foe": -2,
            "hp": -2
          }
        },
        {
          "slot": "right",
          "id": "riposte",
          "label": "Contraatacar",
          "to": "enemy",
          "when": {
            "guard": [
              1,
              1
            ]
          },
          "add": {
            "foe": -4
          },
          "set": {
            "guard": 0
          }
        },
        {
          "slot": "right",
          "id": "slash",
          "label": "Tajo",
          "to": "enemy",
          "when": {
            "guard": [
              0,
              0
            ],
            "equipped": [
              1,
              1
            ]
          },
          "add": {
            "foe": -3,
            "hp": -1
          }
        },
        {
          "slot": "left",
          "id": "guard",
          "label": "Defender",
          "to": "enemy",
          "when": {
            "guard": [
              0,
              0
            ]
          },
          "set": {
            "guard": 1
          },
          "note": "Paras la embestida. Tu contraataque está preparado."
        },
        {
          "slot": "down",
          "id": "retreat",
          "label": "Retirarse",
          "to": "road",
          "set": {
            "foe": 0,
            "guard": 0
          }
        }
      ]
    },
    "courier": {
      "kind": "npc",
      "title": "Mara, la mensajera",
      "body": "«¡Aquí! La rueda me aprisionó el pie. Dile a Ivo que llevaré el correo al alba. Quédate con mi cuchillo de viaje.»",
      "art": "courier",
      "actions": [
        {
          "slot": "up",
          "id": "assist",
          "label": "Ayudar a Mara",
          "to": "loot",
          "set": {
            "quest": 2
          },
          "note": "Mara está a salvo. Vuelve con Ivo para cobrar el encargo."
        }
      ]
    },
    "loot": {
      "kind": "item",
      "title": "Hoja de caminante",
      "body": "Una hoja corta, con mango de asta pulida. El filo aún conserva la marca del herrero del norte.",
      "art": "blade",
      "actions": [
        {
          "slot": "right",
          "id": "take",
          "label": "Recoger",
          "to": "road",
          "when": {
            "space": [
              1,
              3
            ]
          },
          "set": {
            "blade": 1
          },
          "note": "Has guardado la hoja de caminante."
        },
        {
          "slot": "left",
          "id": "leave",
          "label": "Dejar",
          "to": "road"
        }
      ]
    },
    "market": {
      "kind": "place",
      "title": "Mercado de las hierbas",
      "body": "La boticaria descorcha una botella de vidrio verde. «Dos monedas. Hasta las heridas del camino necesitan descanso.»",
      "art": "bottle",
      "actions": [
        {
          "slot": "right",
          "id": "buy",
          "label": "Tónico · 2 oro",
          "to": "market",
          "when": {
            "gold": [
              2,
              999999
            ],
            "space": [
              1,
              3
            ]
          },
          "add": {
            "gold": -2,
            "potions": 1
          },
          "note": "El tónico ocupa un espacio de la mochila."
        },
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "square"
        }
      ]
    },
    "chapel": {
      "kind": "place",
      "title": "Capilla del alba",
      "body": "Una lámpara arde junto al altar. En el silencio de la nave recuperas el aliento.",
      "art": "chapel",
      "actions": [
        {
          "slot": "up",
          "id": "heal",
          "label": "Recobrar vida",
          "to": "chapel",
          "set": {
            "hp": 10
          }
        },
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "square"
        }
      ]
    },
    "gate": {
      "kind": "place",
      "title": "Muralla del norte",
      "body": "Desde el adarve ves el tejado de la posada y el camino de los fresnos.",
      "art": "village",
      "actions": [
        {
          "slot": "up",
          "id": "descend",
          "label": "Bajar al camino",
          "to": "road"
        },
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "square"
        }
      ]
    },
    "well": {
      "kind": "place",
      "title": "El pozo viejo",
      "body": "Al otro lado del brocal alguien ha grabado el nombre de Mara. La cuerda todavía está húmeda.",
      "art": "inn",
      "actions": [
        {
          "slot": "down",
          "id": "return",
          "label": "Regresar",
          "to": "square"
        }
      ]
    }
  },
  "bag": [
    {
      "slot": "bag",
      "id": "drink",
      "label": "Beber tónico",
      "to": "same",
      "when": {
        "potions": [
          1,
          3
        ],
        "hp": [
          1,
          9
        ]
      },
      "add": {
        "potions": -1,
        "hp": 4
      },
      "note": "Bebes un tónico y recuperas hasta cuatro puntos de vida."
    },
    {
      "slot": "bag",
      "id": "equip",
      "label": "Equipar hoja",
      "to": "same",
      "when": {
        "blade": [
          1,
          1
        ],
        "equipped": [
          0,
          0
        ]
      },
      "set": {
        "equipped": 1
      },
      "note": "Llevas la hoja de caminante equipada."
    }
  ],
  "after": [
    {
      "node": "enemy",
      "when": {
        "foe": [
          -4,
          0
        ]
      },
      "to": "courier",
      "set": {
        "foe": 0,
        "guard": 0
      },
      "note": "El lobo se interna en el bosque. Del carro llega una voz."
    },
    {
      "node": "enemy",
      "when": {
        "hp": [
          -2,
          0
        ]
      },
      "to": "chapel",
      "set": {
        "hp": 6,
        "guard": 0,
        "foe": 0
      },
      "note": "Un leñador te lleva hasta la capilla. Podrás volver al camino."
    }
  ]
}
$region$::jsonb);
