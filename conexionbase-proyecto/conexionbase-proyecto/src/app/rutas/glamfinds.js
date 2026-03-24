const conn = require('../../config/database');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const express = require('express');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/gabri/OneDrive/Desktop/Prueba-Proyecto-/GlamFinds/GlamFinds/src/assets/img');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    }
  });
const Filter = require('bad-words');
const filter = new Filter();
const Vibrant = require('node-vibrant'); 

const getColors = require('get-image-colors');
const spanishBadWords = [
    "asesinato", "asno", "bastardo", "bollera", "cabrón", "caca", "chupada", 
    "chupapollas", "chupetón", "concha", "concha de tu madre", "coño", 
    "coprofagía", "culo", "drogas", "esperma", "fiesta de salchichas", 
    "follador", "follar", "gilipichis", "gilipollas", "hacer una paja", 
    "haciendo el amor", "heroína", "hija de puta", "hijaputa", "hijo de puta", 
    "hijoputa", "idiota", "imbécil", "infierno", "jilipollas", "kapullo", 
    "lameculos", "maciza", "macizorra", "maldito", "mamada", "marica", "maricón", 
    "mariconazo", "martillo", "mierda", "nazi", "orina", "pedo", "pendejo", 
    "pervertido", "pezón", "pinche", "pis", "prostituta", "puta", "racista", 
    "ramera", "sádico", "semen", "sexo", "sexo oral", "soplagaitas", 
    "soplapollas", "tetas grandes","tetas",  "tía buena", "travesti", "trio", "verga", 
    "vete a la mierda", "vulva","pene","coito","pito","culito","panochon","culear", "culiar"
  ];
  const frenchBadWords = [
    "baiser", "bander", "bigornette", "bite", "bitte", "bloblos", "bordel", 
    "bourré", "bourrée", "brackmard", "branlage", "branler", "branlette", 
    "branleur", "branleuse", "brouter le cresson", "caca", "chatte", "chiasse", 
    "chier", "chiottes", "clito", "clitoris", "con", "connard", "connasse", 
    "conne", "couilles", "cramouille", "cul", "déconne", "déconner", "emmerdant", 
    "emmerder", "emmerdeur", "emmerdeuse", "enculé", "enculée", "enculeur", 
    "enculeurs", "enfoiré", "enfoirée", "étron", "fille de pute", "fils de pute", 
    "folle", "foutre", "gerbe", "gerber", "gouine", "grande folle", "grogniasse", 
    "gueule", "jouir", "la putain de ta mère", "MALPT", "ménage à trois", "merde", 
    "merdeuse", "merdeux", "meuf", "nègre", "negro", "nique ta mère", "nique ta race", 
    "palucher", "pédale", "pédé", "péter", "pipi", "pisser", "pouffiasse", 
    "pousse-crotte", "putain", "pute", "ramoner", "sac à foutre", "sac à merde", 
    "salaud", "salope", "suce", "tapette", "tanche", "teuch", "tringler", 
    "trique", "troncher", "trou du cul", "turlute", "zigounette", "zizi"
  ];
  const italianBadWords = [
    "allupato", "ammucchiata", "anale", "arrapato", "arrusa", "arruso", 
    "assatanato", "bagascia", "bagassa", "bagnarsi", "baldracca", "balle", 
    "battere", "battona", "belino", "biga", "bocchinara", "bocchino", "bofilo", 
    "boiata", "bordello", "brinca", "bucaiolo", "budiùlo", "busone", "cacca", 
    "caciocappella", "cadavere", "cagare", "cagata", "cagna", "casci", 
    "cazzata", "cazzimma", "cazzo", "cesso", "cazzone", "checca", "chiappa", 
    "chiavare", "chiavata", "ciospo", "ciucciami il cazzo", "coglione", 
    "coglioni", "cornuto", "cozza", "culattina", "culattone", "culo", "ditalino", 
    "fava", "femminuccia", "fica", "figa", "figlio di buona donna", 
    "figlio di puttana", "figone", "finocchio", "fottere", "fottersi", 
    "fracicone", "fregna", "frocio", "froscio", "goldone", "guardone", 
    "imbecille", "incazzarsi", "incoglionirsi", "ingoio", "leccaculo", 
    "lecchino", "lofare", "loffa", "loffare", "mannaggia", "merda", "merdata", 
    "merdoso", "mignotta", "minchia", "minchione", "mona", "monta", "montare", 
    "mussa", "nave scuola", "nerchia", "padulo", "palle", "palloso", "patacca", 
    "patonza", "pecorina", "pesce", "picio", "pincare", "pippa", "pinnolone", 
    "pipì", "pippone", "pirla", "pisciare", "piscio", "pisello", "pistolotto", 
    "pomiciare", "pompa", "pompino", "porca", "porca madonna", "porca miseria", 
    "porca puttana", "porco", "porco due", "porco zio", "potta", "puppami", 
    "puttana", "quaglia", "recchione", "regina", "rincoglionire", "rizzarsi", 
    "rompiballe", "rompipalle", "ruffiano", "sbattere", "sbattersi", "sborra", 
    "sborrata", "sborrone", "sbrodolata", "scopare", "scopata", "scorreggiare", 
    "sega", "slinguare", "slinguata", "smandrappata", "soccia", "socmel", 
    "sorca", "spagnola", "spompinare", "sticchio", "stronza", "stronzata", 
    "stronzo", "succhiami", "succhione", "sveltina", "sverginare", "tarzanello", 
    "terrone", "testa di cazzo", "tette", "tirare", "topa", "troia", "trombare", 
    "vacca", "vaffanculo", "vangare", "zinne", "zio cantante", "zoccola"
  ];
  const russianBadWords = [
    "bychara", "byk", "chernozhopyi", "dolboy'eb", "ebalnik", "ebalo", 
    "ebalom sch'elkat", "gol", "mudack", "opizdenet", "osto'eblo", 
    "ostokhuitel'no", "ot'ebis", "otmudohat", "otpizdit", "otsosi", "padlo", 
    "pedik", "perdet", "petuh", "pidar gnoinyj", "pizda", "pizdato", 
    "pizdatyi", "piz'det", "pizdetc", "pizdoi nakryt'sja", "pizd'uk", 
    "piz`dyulina", "podi ku'evo", "poeben", "po'imat' na konchik", 
    "po'iti posrat", "po khuy", "poluchit pizdy", "pososi moyu konfetku", 
    "prissat", "proebat", "promudobl'adsksya pizdopro'ebina", "propezdoloch", 
    "prosrat", "raspeezdeyi", "raspizdatyi", "raz'yebuy", "raz'yoba", 
    "s'ebat'sya", "shalava", "styervo", "sukin syn", "svodit posrat", "svoloch", 
    "trakhat'sya", "trimandoblydskiy pizdoproyob", "ubl'yudok", "uboy", 
    "u'ebitsche", "vafl'a", "vafli lovit", "v pizdu", "vyperdysh", "vzdrochennyi", 
    "yeb vas", "za'ebat", "zaebis", "zalupa", "zalupat", "zasranetc", "zassat", 
    "zlo'ebuchy", "бздёнок", "блядки", "блядовать", "блядство", "блядь", 
    "бугор", "во пизду", "встать раком", "выёбываться", "гандон", "говно", 
    "говнюк", "голый", "дать пизды", "дерьмо", "дрочить", "другой дразнится", 
    "ёбарь", "ебать", "ебать-копать", "ебло", "ебнуть", "ёб твою мать", 
    "жопа", "жополиз", "играть на кожаной флейте", "измудохать", 
    "каждый дрочит как он хочет", "какая разница", "как два пальца обоссать", 
    "курите мою трубку", "лысого в кулаке гонять", "малофья", "манда", 
    "мандавошка", "мент", "муда", "мудило", "мудозвон", "наебать", 
    "наебениться", "наебнуться", "на фиг", "на хуй", "на хую вертеть", 
    "на хуя", "нахуячиться", "невебенный", "не ебет", "ни за хуй собачу", 
    "ни хуя", "обнаженный", "обоссаться можно", "один ебётся", "опесдол", 
    "офигеть", "охуеть", "охуительно", "половое сношение", "секс", "сиськи", 
    "спиздить", "срать", "ссать", "траxать", "ты мне ваньку не валяй", 
    "фига", "хапать", "хер с ней", "хер с ним", "хохол", "хрен", "хуёво", 
    "хуёвый", "хуем груши околачивать", "хуеплет", "хуило", "хуиней страдать", 
    "хуиня", "хуй", "хуйнуть", "хуй пинать"
  ];
  const koreanBadWords = [
    "강간", "개새끼", "개자식", "개좆", "개차반", "거유", "계집년", "고자", "근친", "노모", 
    "니기미", "뒤질래", "딸딸이", "때씹", "또라이", "뙤놈", "로리타", "망가", "몰카", 
    "미친", "미친새끼", "바바리맨", "변태", "병신", "보지", "불알", "빠구리", "사까시", 
    "섹스", "스와핑", "쌍놈", "씨발", "씨발놈", "씨팔", "씹", "씹물", "씹빨", "씹새끼", 
    "씹알", "씹창", "씹팔", "암캐", "애자", "야동", "야사", "야애니", "엄창", "에로", 
    "염병", "옘병", "유모", "육갑", "은꼴", "자위", "자지", "잡년", "종간나", "좆", 
    "좆만", "죽일년", "쥐좆", "직촬", "짱깨", "쪽바리", "창녀", "포르노", "하드코어", 
    "호로", "화냥년", "후레아들", "후장", "희쭈그리"
  ];
// Añadir palabras ofensivas a la instancia
filter.addWords(...spanishBadWords);
filter.addWords(...frenchBadWords);
filter.addWords(...italianBadWords);
filter.addWords(...russianBadWords);
filter.addWords(...koreanBadWords);

       
const upload = multer({ storage: storage });
const router = express.Router();

   

    const colorShades = {
        amarillo: [
            { name: 'almendra', rgb: [239, 222, 205] },
            { name: 'amarillo mostaza', rgb: [208, 166, 35] },
            { name: 'arena', rgb: [194, 178, 128] },
            { name: 'amarillo brillante', rgb: [255, 255, 0] },
            { name: 'amarillo palido', rgb: [255, 255, 153] },
            { name: 'amarillo dorado', rgb: [255, 223, 0] },
            { name: 'amarillo limon', rgb: [255, 247, 0] },
            { name: 'amarillo pastel', rgb: [255, 239, 170] },
            { name: 'amarillo oscuro', rgb: [204, 204, 0] },
            { name: 'dorado', rgb: [210, 180, 120] },
            { name: 'amarillo camel', rgb: [193, 154, 107] },
        ],
        azul: [
            { name: 'azul acero', rgb: [70, 130, 180] },
            { name: 'azul claro', rgb: [173, 216, 230] },
            { name: 'azul celeste', rgb: [135, 206, 235] },
            { name: 'azul cobalto', rgb: [61, 89, 171] },
            { name: 'azul marino', rgb: [0, 0, 128] },
            { name: 'azul marino', rgb: [0, 25, 57] },
            { name: 'azul oscuro', rgb: [23, 29, 48] },
            { name: 'azul oscuro', rgb: [0, 0, 139] },
            { name: 'azul rey', rgb: [65, 105, 225] },
            { name: 'azul turquesa', rgb: [64, 224, 208] },
            { name: 'azul grisaceo', rgb: [0, 128, 189] },
            { name: 'azul cielo', rgb: [135, 206, 235] },
            { name: 'azul real', rgb: [65, 105, 225] },
            { name: 'azul zafiro', rgb: [15, 82, 186] },
            { name: 'azul cobalto', rgb: [0, 71, 171] },
            { name: 'azul rey', rgb: [72, 61, 139] },
            { name: 'azul indigo', rgb: [75, 0, 130] },
            { name: 'azul vaquero', rgb: [33, 67, 95] },
            { name: 'azul petroleo', rgb: [0, 99, 126] },
            { name: 'azul aqua', rgb: [127, 255, 212] },
            { name: 'azul genciana', rgb: [30, 144, 255] },
            { name: 'azul denim', rgb: [21, 96, 189] },
            { name: 'azul noche', rgb: [25, 25, 112] },
            { name: 'azul electrico', rgb: [44, 117, 255] },
            { name: 'azul pastel', rgb: [174, 198, 207] },
            { name: 'azul lavanda', rgb: [230, 230, 250] },
            { name: 'azul hielo', rgb: [173, 216, 230] },
            { name: 'azul ceruleo', rgb: [42, 82, 190] },
            { name: 'azul Mediterraneo', rgb: [0, 121, 191] },
            { name: 'azul grisáceo', rgb: [96, 130, 182] },
            { name: 'azul cobalto oscuro', rgb: [61, 89, 171] },
            { name: 'azul pastel suave', rgb: [189, 183, 107] },
            { name: 'azul cian', rgb: [0, 255, 255] },
            { name: 'celeste', rgb: [153, 172, 182] },
            { name: 'azul oscuro', rgb: [39, 39, 48] },
            { name: 'azul turquesa clarito', rgb: [57, 85, 97] },
            { name: 'azul oscuro grisoso', rgb: [54, 69, 79] },
            { name: 'azul obscuro celeste', rgb: [112, 128, 144] },
        ],
        beige: [
            { name: 'beige', rgb: [183, 166, 149] },
            { name: 'beige claro', rgb: [245, 245, 220] },
            { name: 'beige claro', rgb: [230, 188, 137] },
            { name: 'beige grisaceo', rgb: [190, 187, 185] },
            { name: 'beige oscuro', rgb: [210, 180, 140] },
            { name: 'beige oscuro', rgb: [167, 116, 81] },
            { name: 'beige arenoso', rgb: [222, 202, 170] },
            { name: 'beige palido', rgb: [245, 245, 200] },
            { name: 'beige dorado', rgb: [210, 180, 120] },
            { name: 'beige intenso', rgb: [126, 116, 100] },
        ],
        blanco: [
            { name: 'blanco', rgb: [255, 255, 255] },
            { name: 'blanco hueso', rgb: [255, 250, 240] },
            { name: 'blanco perla', rgb: [252, 244, 248] },
            { name: 'blanco nieve', rgb: [255, 250, 250] },
            { name: 'blanco marfil', rgb: [255, 255, 240] },
            { name: 'blanco roto', rgb: [245, 245, 245] },
            { name: 'blanco suave', rgb: [225, 220, 219] },
            { name: 'blanco hueso gris', rgb: [214, 210, 212] },
        ],
        gris: [
            { name: 'gris', rgb: [197, 196, 196] },
            { name: 'gris azulado claro', rgb: [202, 206, 217] },
            { name: 'gris claro', rgb: [220, 225, 228] },
            { name: 'gris claro', rgb: [211, 211, 211] },
            { name: 'gris oscuro', rgb: [169, 169, 169] },
            { name: 'gris oscuro', rgb: [71, 65, 127] },
            { name: 'gris plata', rgb: [192, 192, 192] },   
        ],
        
        marron: [
            { name: 'marron', rgb: [148, 134, 119] },
            { name: 'marron camel', rgb: [193, 154, 107] },
            { name: 'marron claro', rgb: [210, 180, 140] },
            { name: 'marron grisaceo', rgb: [139, 114, 103] },
            { name: 'marron oscuro', rgb: [139, 69, 19] },
            { name: 'marron palido', rgb: [189, 176, 185] },
            { name: 'marron rojizo', rgb: [57, 32, 26] },
            { name: 'marron terracota', rgb: [166, 104, 70] },
            { name: 'marron cobre', rgb: [184, 115, 51] },
            { name: 'marron castaño', rgb: [139, 69, 19] },
            { name: 'marron nuez', rgb: [150, 75, 0] },
            { name: 'marron tierra', rgb: [222, 184, 135] },
            { name: 'marron caramelo', rgb: [175, 111, 71] },
            { name: 'marron miel', rgb: [201, 140, 70] },
            { name: 'cafe', rgb: [165, 42, 42] },
            { name: 'chocolate', rgb: [210, 105, 30] },
            { name: 'marron camel', rgb: [193, 154, 107] },
            { name: 'marron claro', rgb: [210, 180, 140] },
            { name: 'marron grisaceo', rgb: [139, 114, 103] },
            { name: 'marron oscuro', rgb: [139, 69, 19] },
            { name: 'marron rojizo', rgb: [57, 32, 26] },
            { name: 'marron terracota', rgb: [166, 104, 70] },
            { name: 'marron cobre', rgb: [184, 115, 51] },
            { name: 'marron castaño', rgb: [139, 69, 19] },
            { name: 'marron nuez', rgb: [150, 75, 0] },
            { name: 'marron caoba', rgb: [128, 0, 0] },
            { name: 'marron caramelo', rgb: [175, 111, 71] },
            { name: 'marron miel', rgb: [201, 140, 70] },
            { name: 'marron tierra', rgb: [222, 184, 135] },
            { name: 'marron grisaceo', rgb: [105, 65, 62] },
            { name: 'marron suave', rgb: [192, 183, 173] },
            { name: 'marron arcilla', rgb: [198, 156, 109] },
            { name: 'cafe chocolate', rgb: [66, 59, 51] },
            { name: 'cafe apagado', rgb: [58, 38, 27] },
            { name: 'cafe clarito', rgb: [71, 67, 63] },
            { name: 'cafe medio', rgb: [86, 74, 81] },
            { name: 'cafe verdoso', rgb: [111, 105, 119] },
    
        ],
        morado: [
            { name: 'morado', rgb: [128, 0, 128] },
            { name: 'morado noche', rgb: [64, 0, 64] },
            { name: 'morado oscuro', rgb: [75, 0, 130] },
            { name: 'morado pastel', rgb: [218, 112, 214] },
            { name: 'morado real', rgb: [102, 51, 153] },
            { name: 'morado intenso', rgb: [30, 34, 48] },
            { name: 'morado lavanda', rgb: [230, 230, 250] },
            { name: 'morado ciruela', rgb: [142, 69, 133] },
            { name: 'morado berenjena', rgb: [97, 49, 103] },
            { name: 'lavanda', rgb: [230, 230, 250] },
            { name: 'lila', rgb: [200, 162, 200] },
            { name: 'lila suave', rgb: [217, 210, 215] },
            { name: 'lila', rgb: [188, 180, 196] },
            { name: 'malva', rgb: [224, 176, 255] },
            { name: 'violeta', rgb: [238, 130, 238] },
            { name: 'violeta claro', rgb: [199, 21, 133] },
            { name: 'violeta medio', rgb: [138, 43, 226] },
            { name: 'violeta oscuro', rgb: [148, 0, 211] },
            { name: 'violeta intenso', rgb: [110, 47, 145] },
            { name: 'orquidea media', rgb: [186, 85, 211] },
            { name: 'orquidea oscuro', rgb: [153, 50, 204] },
            { name: 'purpura', rgb: [128, 0, 128] },
            { name: 'purpura claro', rgb: [147, 112, 219] },
            { name: 'purpura oscuro', rgb: [104, 34, 139] },
            { name: 'purpura profundo', rgb: [102, 2, 60] },
            { name: 'purpura intenso', rgb: [71, 12, 107] }
    
        ],
        naranja: [
            { name: 'naranja', rgb: [215, 70, 11] },
            { name: 'naranja oscuro', rgb: [215, 115, 50] },
            { name: 'naranja brillante', rgb: [255, 165, 0] },
            { name: 'naranja pastel', rgb: [255, 195, 160] },
            { name: 'naranja quemado', rgb: [204, 85, 0] },
            { name: 'naranja mandarina', rgb: [255, 140, 0] },
            { name: 'naranja coral', rgb: [255, 127, 80] },
            { name: 'terracota', rgb: [198, 104, 70] }
        ],
        negro: [
            { name: 'negro', rgb: [0, 0, 0] },
            { name: 'negro suave', rgb: [26, 24, 23] },
            { name: 'negro carbon', rgb: [54, 69, 79] },
            { name: 'negro azabache', rgb: [0, 0, 0] },
            { name: 'negro onix', rgb: [36, 36, 36] }
        ],
        rojo: [
            { name: 'rojo brillante', rgb: [255, 0, 0] },
            { name: 'rojo carmesi', rgb: [220, 20, 60] },
            { name: 'rojo coral', rgb: [255, 127, 80] },
            { name: 'rojo oscuro', rgb: [139, 0, 0] },
            { name: 'rojo oscuro', rgb: [97, 21, 38] },
            { name: 'rojo ladrillo', rgb: [178, 34, 34] },
            { name: 'rojo oxido', rgb: [165, 42, 42] },
            { name: 'rojo sangre', rgb: [150, 7, 38] }
        ],
        rosa: [
            { name: 'rosa bebe', rgb: [255, 192, 203] },
            { name: 'rosa claro', rgb: [255, 182, 193] },
            { name: 'rosa claro', rgb: [225, 198, 231] },
            { name: 'rosa fuerte', rgb: [255, 20, 147] },
            { name: 'rosa intenso', rgb: [255, 105, 180] },
            { name: 'rosa mexicano', rgb: [226, 0, 116] },
            { name: 'rosa muy pálido', rgb: [255, 240, 245] },
            { name: 'rosa pastel', rgb: [255, 174, 185] },
            { name: 'rosa polvo', rgb: [219, 112, 147] },
            { name: 'rosa palido', rgb: [233, 225, 219] },
            { name: 'rosa viejo', rgb: [188, 143, 143] },
            { name: 'rosado palido', rgb: [200, 177, 176] },
            { name: 'rosa palido blanco', rgb: [214, 214, 215] },
        ],
        verde: [
            { name: 'verde azulado', rgb: [112, 96, 82] },
            { name: 'verde botella', rgb: [0, 106, 78] },
            { name: 'verde claro', rgb: [183, 232, 164] },
            { name: 'verde claro', rgb: [144, 238, 144] },
            { name: 'verde esmeralda', rgb: [80, 200, 120] },
            { name: 'verde intenso', rgb: [30, 34, 48] },
            { name: 'verde lima', rgb: [50, 205, 50] },
            { name: 'verde menta', rgb: [152, 251, 152] },
            { name: 'verde menta', rgb: [203, 219, 178] },
            { name: 'verde musgo', rgb: [85, 107, 47] },
            { name: 'verde musgo', rgb: [47, 39, 53] },
            { name: 'verde oliva', rgb: [163, 159, 141] },
            { name: 'verde oliva', rgb: [126, 88, 166] },
            { name: 'verde oliva claro', rgb: [203, 183, 187] },
            { name: 'verde oliva oscuro', rgb: [50, 40, 28] },
            { name: 'verde oliva oscuro', rgb: [180, 170, 157] },
            { name: 'verde seco', rgb: [140, 143, 100] },
            { name: 'verde azulado', rgb: [60, 55, 42] },
            { name: 'verde cafe', rgb: [53, 52, 46] },
        ]};
        let prendasArray = []; 
        function getAllColors(colorShades) {
            let allColors = [];
            for (const category in colorShades) {
                allColors = allColors.concat(colorShades[category]);
            }
            return allColors;
        }
        function getAllClothes(prendas) {
            let allClothes = []; 
        
            for (const category in prendas) {
                allClothes= allClothes.concat(prendas[category]);
            }
            return allClothes;
        }
        function actualizarPrendasDetectadas(prendasArray) {
            const allClothes = getAllClothes(prendasArray);
            console.log("Nuevas prendas detectadas:", allClothes);
            return allClothes;
        }  
        function colorDistance(c1, c2) {
            const [r1, g1, b1] = c1;
            const [r2, g2, b2] = c2;
            return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
        }
        // Función para encontrar el color más cercano
        function findClosestColor(rgbColor, colorList) {
            let closestColor = colorList[0];
            let minDistance = colorDistance(rgbColor, closestColor.rgb);
            for (const color of colorList) {
                const distance = colorDistance(rgbColor, color.rgb);
                if (distance < minDistance) {
                    closestColor = color;
                    minDistance = distance;
                }
            }
            return closestColor.name;
        }

    //-----------------------------------------------------------------------------------------------

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = '9bf03781e3504ef9be1b4e0315ee843a';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'swjtw3uozp3p';
    const APP_ID = 'apicolor';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'apparel-detection';
    const MODEL_VERSION_ID = '1ed35c3d176f45d69d2aa7971e6ab9fe';

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
    const stub = ClarifaiStub.grpc();
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);
    const fs = require("fs");


    let vibrantColor = null;
    let mutedColor = null;
    let thirdColor = null;
    let vibrantColorClass = null;
    let mutedColorClass = null;
    let thirdColorClass = null;
                        


    let prenda2 = null;
    let prenda3 = null;    
    let prenda4 = null;
    let prenda5 = null;
    let prenda6 = null;

    let link1 = null;
    let link2 = null;
    let link3 = null;
    let link4 = null;
    let link5 = null;
    let link6 = null;

    //---------------------------- API para noticias de moda---------------------------------------
    const API_KEY = '2f06a1e547694e35a997abd109e72272';
    router.get('/api-fashion-trends', async (req, res) => {
    const { page = 1} = req.query;
    try {
        const response = await axios.get(
        `https://newsapi.org/v2/everything?q=fashion AND moda&sortBy=popularity&language=es&apiKey=2f06a1e547694e35a997abd109e72272`
        );
        const articles = response.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        link: article.url,
        image: article.urlToImage,
        source: article.source.name
        }));
        res.json(articles);
    } catch (error) {
        console.error('Error fetching data from NewsAPI:', error.message);
        res.status(500).json({ message: 'Error fetching data from NewsAPI' });
    }
    });
    /*------------POST GENERALES---------------------- */
    const generateSheinLink = (prenda, color) => {
        const baseSearch = encodeURIComponent(`${prenda} ${color}`);
        const baseUrl = `https://us.shein.com/pdsearch/${baseSearch}/?ici=s1%60RecentSearch%60${baseSearch}%60_fb%60d0%60PageHome&search_source=1&search_type=all&source=historyWord&src_identifier=st%3D5%60sc%3D${baseSearch}%60sr%3D0%60ps%3D1&src_identifier_pre_search=&src_module=search&src_tab_page_id=page_home1734279425230`;
        return baseUrl;
    };
    router.post('/agregarPost', upload.single('imagen'), async (req, res) => {
        const mediaPath = req.file;
        if (!mediaPath) {
            return res.json({ status: 0, mensaje: "No se proporcionó una imagen o video", datos: [] });
        }
        const path_value = mediaPath.filename;
        const { descripcion, autor, categoria,prenda1 } = req.body;
        const fileExtension = path.extname(path_value).toLowerCase();
            if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' || fileExtension === '.gif') {
                const fullPath = path.join('C:/Users/gabri/OneDrive/Documentos/Codigo-Fuente-SP2-main/GlamFinds/GlamFinds/src/assets/img', path_value);
                const imageBytes = fs.readFileSync(fullPath, { encoding: 'base64' });
                try {
                    const query = `INSERT INTO posts_generales (descripcion, imagen, autor, categoria, color_vibrant, color_muted, color_third,vibrant_class, muted_class, third_class, prenda1, prenda2, prenda3, prenda4, prenda5, prenda6,link1, link2, link3, link4, link5, link6) VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?, ?, ?, ?, ?)`;
                    const values = [descripcion, path_value, autor, categoria, link1, link2, link3, link4, link5, link6];
                    conn.query(query, values, (insertError, insertResult) => {
                        if (insertError) {
                            console.error(insertError);
                            return res.json({ status: 0, mensaje: "Error al insertar en la BD", datos: [] });
                        }
                        const postId = insertResult.insertId;
                        res.json({
                            status: 1,
                            mensaje: "Publicación creada exitosamente. Procesando colores y clasificación...",
                            datos: { postId }
                        });
                        stub.PostModelOutputs({
                                user_app_id: {
                                    user_id: USER_ID,
                                    app_id: APP_ID
                                },
                                model_id: MODEL_ID,
                                version_id: MODEL_VERSION_ID,
                                inputs: [
                                    {
                                        data: {
                                            image: {
                                                base64: imageBytes,
                                                allow_duplicate_url: true
                                            }
                                        }
                                    }
                                ]
                            },
                            metadata,
                            async (err, response) => {
                                if (err) {
                                    console.error("Error en el modelo:", err);
                                    return;
                                }
                                if (response.status.code !== 10000) {
                                    console.error("Error en el modelo:", response.status.description);
                                    return;
                                }
                                const regions = response.outputs[0]?.data?.regions || [];
                                if (regions.length === 0) {
                                    console.error("No se detectaron regiones en la imagen.");
                                    return;
                                }
                                const prendasArray = [];
                                const shoppingLinks = [];
                                for (const region of regions) {
                                    const concepto = region.data.concepts[0];
                                    const confianza = concepto.value * 100;
                                    if (confianza < 75) {
                                        console.error("Región con confianza baja");
                                    } else {
                                        prendasArray.push({ nombre: concepto.name });
                                        const { top_row, left_col, bottom_row, right_col } = region.region_info.bounding_box;
                                        const metadata = await sharp(fullPath).metadata();
                                        const cropX1 = Math.round(left_col * metadata.width);
                                        const cropY1 = Math.round(top_row * metadata.height);
                                        const cropWidth = Math.round((right_col - left_col) * metadata.width);
                                        const cropHeight = Math.round((bottom_row - top_row) * metadata.height);
                                        if (cropWidth <= 0 || cropHeight <= 0) {
                                            console.error("Dimensiones invalidas");
                                        } else {
                                            const croppedImagePath = `cropped_${Date.now()}.jpg`;
                                            try {
                                                await sharp(fullPath).extract({ left: cropX1, top: cropY1, width: cropWidth, height: cropHeight }).toFile(croppedImagePath);
                                                const colors = await getColors(croppedImagePath);
                                                if (!colors || colors.length === 0) {
                                                    console.error("No se encontraron colores.");
                                                } else {
                                                    const dominantColorClass = findClosestColor(colors[0].rgb(),getAllColors(colorShades));
                                                    const link = generateSheinLink(concepto.name, dominantColorClass);
                                                    shoppingLinks.push(link);
                                                }
                                            } catch (error) {
                                                console.error("Error al procesar la región:", error);
                                            } finally {
                                                if (fs.existsSync(croppedImagePath)) {
                                                    fs.unlinkSync(croppedImagePath);
                                                }
                                            }
                                        }
                                    }
                                }
                               
                                const allColors = getAllColors(colorShades);
                                const colors = await getColors(fullPath);
                                const vibrantColor = colors[0].hex();
                                const mutedColor = colors[1].hex();
                                const thirdColor = colors[2].hex();
                                const vibrantColorClass = findClosestColor(colors[0].rgb(), allColors);
                                const mutedColorClass = findClosestColor(colors[1].rgb(), allColors);
                                const thirdColorClass = findClosestColor(colors[2].rgb(), allColors);

                                
                                const prendasUnicas = prendasArray.filter((prenda, index, self) =>
                                    index === self.findIndex((t) => t.nombre === prenda.nombre)
                                );
                                const prenda1 = prendasUnicas[0]?.nombre || null;
                                const prenda2 = prendasUnicas[1]?.nombre || null;
                                const prenda3 = prendasUnicas[2]?.nombre || null;
                                const prenda4 = prendasUnicas[3]?.nombre || null;
                                const prenda5 = prendasUnicas[4]?.nombre || null;
                                const prenda6 = prendasUnicas[5]?.nombre || null;
                                const link1 = shoppingLinks[0] || null;
                                const link2 = shoppingLinks[1] || null;
                                const link3 = shoppingLinks[2] || null;
                                const link4 = shoppingLinks[3] || null;
                                const link5 = shoppingLinks[4] || null;
                                const link6 = shoppingLinks[5] || null;
                                const queryU = `UPDATE posts_generales SET color_vibrant = ?, color_muted = ?, color_third = ?,vibrant_class = ?, muted_class = ?, third_class = ?, prenda1 = ?, prenda2 = ?, prenda3 = ?, prenda4 = ?, prenda5 = ?, prenda6 = ?,link1 = ?, link2 = ?, link3 = ?, link4 = ?, link5 = ?, link6 = ? WHERE id_post = ?`;
                                const valuesU = [vibrantColor, mutedColor, thirdColor,vibrantColorClass, mutedColorClass, thirdColorClass,prenda1, prenda2, prenda3, prenda4, prenda5, prenda6,link1,link2,link3,link4,link5,link6,postId];
                                conn.query(queryU, valuesU, (updateError) => {
                                    if (updateError) {
                                        console.error("Error al actualizar la publicación:", updateError);
                                    } else {
                                        console.log(`Publicación actualizada con éxito. ID: ${postId}`);
                                    }
                                });
                            }
                        );
                    });
                } catch (error) {
                    console.error("Error general:", error);
                    res.status(500).json({ status: 0, mensaje: "Error al procesar el archivo", datos: [] });
                }
            }else if (fileExtension === '.mp4' || fileExtension === '.avi' || fileExtension === '.mov') {
                const query = `INSERT INTO posts_generales (descripcion, imagen, autor, categoria) VALUES (?, ?, ?, ?)`;
                const values = [descripcion, path_value, autor, categoria];
                conn.query(query, values, (error, filas) => {
                    if (error) {
                        console.error(error);
                        return res.json({ status: 0, mensaje: "Error al insertar el video en la BD", datos: [] });
                    } else {
                        return res.json({ status: 1, mensaje: "Video insertado con éxito", datos: filas });
                    }
                });
            }else {
                return res.json({ status: 0, mensaje: "Formato de archivo no soportado", datos: [] });
            }
    });

    //Se usa agarrar todos los articulos de tendencias 
    router.get('/obtener',(req, res) => {
        let obtener = 'SELECT p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria, p.color_vibrant, p.color_muted, p.color_third , p.vibrant_class, p.muted_class, p.third_class,p.prenda1,p.prenda2,p.prenda3,p.prenda4,p.prenda5,p.prenda6,p.link1,p.link2, p.link3, p.link4, p.link5,p.link6  FROM  posts_generales p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 1 order by p.id_post ASC';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de tendencias obtenida con exito", datos: filas});
            }
        });
        
    });
    //Se usa agarrar todos los articulos de ropa 
    router.get('/getRopa',(req, res) => {
        let obtener = 'Select p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria, p.color_vibrant, p.color_muted, p.color_third , p.vibrant_class, p.muted_class, p.third_class,p.prenda1,p.prenda2,p.prenda3,p.prenda4,p.prenda5,p.prenda6,p.link1,p.link2, p.link3, p.link4, p.link5,p.link6  FROM  posts_generales p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 2 order by p.id_post ASC';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });
    });
     //Se usa agarrar todos los articulos de zapatos 
     router.get('/getZapatos',(req, res) => {
        let obtener = 'Select p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria, p.color_vibrant, p.color_muted, p.color_third , p.vibrant_class, p.muted_class, p.third_class,p.prenda1,p.prenda2,p.prenda3,p.prenda4,p.prenda5,p.prenda6,p.link1,p.link2, p.link3, p.link4, p.link5,p.link6 FROM  posts_generales p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 5 order by p.id_post ASC';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de zapatos obtenida con exito", datos: filas});
            }
        });
    });
     //Se usa agarrar todos los articulos de Maquillaje 
     router.get('/getMaquillaje',(req, res) => {
        let obtener = 'Select p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria, p.color_vibrant, p.color_muted, p.color_third , p.vibrant_class, p.muted_class, p.third_class,p.prenda1,p.prenda2,p.prenda3,p.prenda4,p.prenda5,p.prenda6,p.link1,p.link2, p.link3, p.link4, p.link5,p.link6 FROM  posts_generales p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 3 order by p.id_post ASC';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de maquillaje obtenida con exito", datos: filas});
            }
        });
        
    });
    //Se usa agarrar todos los articulos de accesorios 
    router.get('/getAccesorios',(req, res) => {
        let obtener = 'Select p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria, p.color_vibrant, p.color_muted, p.color_third , p.vibrant_class, p.muted_class, p.third_class,p.prenda1,p.prenda2,p.prenda3,p.prenda4,p.prenda5,p.prenda6,p.link1,p.link2, p.link3, p.link4, p.link5,p.link6 FROM  posts_generales p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 4 order by p.id_post ASC';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de accesorios obtenida con exito", datos: filas});
            }
        });  
    });
    //Devolver la cantidad de likes de los Post Generales
    router.get('/countLike:id',(req, res) => {
        const {id} = req.params;
        let obtener = 'SELECT count(*) as cantidad from likes_postG l ,posts_generales p where p.id_post = l.post and p.id_post =?';
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de cantidad likes obtenida con exito", datos: filas});
            }
        });   
    });

    //Guardar los likes del los usuarios logueados
    router.post('/likes',(req, res) => {
        let query = `insert into likes_postG(post,navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Like insertado con éxito", datos: []});
            }
        });
    });

    //Insertar los guardados de los usuarios logueados
    router.post('/save',(req, res) => {
        let query = `insert into save_postG(post,navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Post guardada con éxito", datos: []});
            }
        });
    });
    //Devolver los comentarios de los Post Generales
    router.get('/getComentarios:id',(req, res) => {
        const {id} = req.params;
        let obtener = 'SELECT c.post,c.navegante ,u.usuario, c.comments, c.id_comment FROM  posts_generales p, usuarios u , comments_postG c where p.id_post = c.post and c.navegante = u.id_user and p.id_post =?';
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de comentarios obtenida con exito", datos: filas});
            }
        });
    });
  
    //Inserta los comentarios de los usuarios logueados
   router.post('/comments',(req, res) => {
    const { post, navegante} = req.body;
    
        // Verificar si el comentario tiene palabras ofensivas
        if (filter.isProfane(req.body.comments)) {
            return res.json({status: 0, mensaje: "Comentario inapropiado detectado.", datos: []});
        }else{
            // Si el comentario es aceptable, construimos la consulta
        let query = `INSERT INTO comments_postG(post, navegante, comments) VALUES('${post}', '${navegante}', '${req.body.comments}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Comentario insertado con éxito", datos: []});
            }
        });
        }   
    });

    //nuevas funciones agregadas

    router.delete('/borrarLikes/:id/:id2', (req, res) => {
        const {id} = req.params.id;
        let consulta = `DELETE FROM likes_postg WHERE post = ${req.params.id} and navegante = ${req.params.id2}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.delete('/borrarSaves/:id/:id2', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM save_postg WHERE post = ${req.params.id} and navegante = ${req.params.id2}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.post('/updateCom/:id3',(req, res) => {
        //res.json({ mensaje: "Ejecutando metodo get"});
        const {id} = req.params;
        let obtener =` update comments_postg set post ='${req.body.post}' ,navegante ='${req.body.navegante}' , comments = '${req.body.comments}' where id_comment = ${req.params.id3}; ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Comentario modificado con exito", datos: filas});
            }
        });
    });
    router.delete('/borrarComment/:id/:id2/:id3', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM comments_postg WHERE post = ${req.params.id} and navegante = ${req.params.id2} and id_comment = ${req.params.id3}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });

     router.get('/getComment/:id/:id2/:id3',(req, res) => {
        const {id} = req.params;
        let obtener = `SELECT id_comment, post,navegante,comments FROM  comments_postG  where post = ${req.params.id} and navegante = ${req.params.id2} and id_comment = ${req.params.id3}`;
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de comentarios obtenida con exito", datos: filas});
            }
        });
    });

    /*-------------------POST PUBLICIDAD------------------*/

    //Se usa para tomar todos los articulos de descuentos
    router.get('/getDescuentos',(req, res) => {
        let obtener = 'SELECT p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria,p.link FROM  posts_publicidad p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 6';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de descuentos obtenida con exito", datos: filas});
            }
        });
    });
    //Se usa para tomar todos los articulos de dups
    router.get('/getDups',(req, res) => {
        let obtener = 'SELECT p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria,p.link FROM  posts_publicidad p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and id_categoria = 7';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de dups obtenida con exito", datos: filas});
            }
        });
    });
    //Se usa para agregar post publicidad
    router.post('/agregarPostP', upload.single('imagen'), (req, res) => {
        const imagePath = req.file;
        if (!imagePath) {
            return res.json({ status: 0, mensaje: "No se proporcionó una imagen", datos: [] });
        }
        const path_value = imagePath.filename;
        const { descripcion, autor,link, categoria } = req.body;
        const query = 'INSERT INTO posts_publicidad(descripcion, imagen, autor,link,categoria) VALUES (?, ?, ?, ?,?)';
        const values = [descripcion, path_value, autor,link, categoria];
        conn.query(query, values, (error, filas) => {
            if (error) {
                console.error(error);
                res.json({ status: 0, mensaje: "Error al insertar en la BD", datos: [] });
            } else {
                res.json({ status: 1, mensaje: "Post insertado con éxito", datos: [] });
            }
        });
    });

    //Devolver la cantidad de likes de los Post Generales
    router.get('/countLikeP:id',(req, res) => {
        const {id} = req.params;
        let obtener = `SELECT count(*) as cantidads from likes_postp l , posts_publicidad p where p.id_post = l.post and p.id_post = ${req.params.id}`;
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de cantidad likes obtenida con exito", datos: filas});
            }
        });   
    });

    //Devolver los comentarios de los Post Publicidad
    router.get('/getCommentsP:id',(req, res) => {
        const {id} = req.params;
        let obtener = 'SELECT c.post,c.navegante ,u.usuario, c.comments , c.id_comment FROM  posts_publicidad p, usuarios u , comments_postP c where p.id_post = c.post and c.navegante = u.id_user and p.id_post =?';
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de comentarios obtenida con exito", datos: filas});
            }
        });
    });
    //Inserta los comentarios de los usuarios logueados Publicidad
    router.post('/commentsP',(req, res) => {
        let query = `insert into comments_postp(post,navegante,comments) VALUES('${req.body.post}','${req.body.navegante}','${req.body.comments}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Comentario insertado con éxito", datos: []});
            }
        });
    });
    //Guardar los likes del los usuarios logueados
    router.post('/likesP',(req, res) => {
        let query = `insert into likes_postp(post,navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Like insertado con éxito", datos: []});
            }
        });
    });
    //Insertar los guardados de los usuarios logueados
    router.post('/saveP',(req, res) => {
        let query = `insert into save_postp(post,navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Post guardada con éxito", datos: []});
            }
        });
    });

    //nuevas funciones agregadas con respecto a comentarios y likes
    router.delete('/borrarLikesP/:id/:id2', (req, res) => {
        const {id} = req.params.id;
        let consulta = `DELETE FROM likes_postp WHERE post = ${req.params.id} and navegante = ${req.params.id2}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.delete('/borrarSavesP/:id/:id2', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM save_postp WHERE post = ${req.params.id} and navegante = ${req.params.id2}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.post('/updateComP/:id3',(req, res) => {
        //res.json({ mensaje: "Ejecutando metodo get"});
        const {id} = req.params;
        let obtener =` update comments_postp set post ='${req.body.post}' ,navegante ='${req.body.navegante}' , comments = '${req.body.comments}' where id_comment = ${req.params.id3}; ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Comentario modificado con exito", datos: filas});
            }
        });
    });
    router.delete('/borrarCommentP/:id/:id2/:id3', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM comments_postp WHERE post = ${req.params.id} and navegante = ${req.params.id2} and id_comment = ${req.params.id3}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });

     router.get('/getCommentP/:id/:id2/:id3',(req, res) => {
        const {id} = req.params;
        let obtener = `SELECT id_comment, post,navegante,comments FROM  comments_postp  where post = ${req.params.id} and navegante = ${req.params.id2} and id_comment = ${req.params.id3}`;
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de comentarios obtenida con exito", datos: filas});
            }
        });
    });

    /*------------USUARIO-----------*/

     //Se usa agarrar un usuario por su id 
     router.get('/user:id',(req, res) => {
        const {id} = req.params;
        let query = 'SELECT * FROM usuarios where id_user = ?';
        conn.query(query,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de user obtenida con exito", datos: filas});
            }
        });  
    });

    //Agregar un nuevo usuario 
    router.post('/login', upload.single('imagen'), (req, res) => {
        const imagePath = req.file;
        if (!imagePath) {
          const error = new Error('No file');
          error.httpStatusCode = 400;
          return res.json({ status: 0, mensaje: "No se proporcionó una imagen", datos: [] });
        }
        console.log(imagePath);
        const path_value = imagePath.filename;
        console.log(path_value);
        const { usuario, nombre, apellido, edad, sexo, correo, contrase ,descripcion} = req.body;
        const query = `INSERT INTO usuarios (usuario, nombre, apellido, edad, sexo, correo, contrase, imagen,descripcion) 
                       VALUES('${usuario}', '${nombre}', '${apellido}', '${edad}', '${sexo}', '${correo}', '${contrase}', '${path_value}','${descripcion}')`;
        conn.query(query, (error, filas) => {
          if (error) {
            res.json({ status: 0, mensaje: "Error al insertar usuario en la BD", datos: [] });
          } else {
            res.json({ status: 1, mensaje: "Usuario insertado con éxito", datos: filas});
          }
        });
      });
    //Verificar si existe el usuario
    router.post("/verificar", (req, res) => {
        let consulta = `SELECT id_user,usuario,contrase FROM usuarios WHERE 
                        usuario ='${req.body.usuario}' AND contrase = '${req.body.contrase}'`;
        conn.query(consulta, (error,filas) =>{
            if(error){
                res.status(500).json({status:0, mensaje: "Err Base de datos"});
            }else{
                if(filas.length > 0){
                    res.json({status: 1, mensaje: "Usuario exitoso", datos: filas});
                }else{
                    res.status(400).json({status: 0, mensaje: "No se encontro usuario que coinsida con la clave"})
                }  
            }
        }); 
    });
    //LLama a las publicaciones guardadas por el usuario
    router.get('/getsave:id',(req, res) => {
        const {id} = req.params;
        let obtener =` SELECT p.id_post, p.descripcion,u.usuario,u.imagen, p.imagen,c.name_categoria,s.navegante FROM save_postG s
                    INNER JOIN posts_generales p ON p.id_post = s.post
                    INNER JOIN usuarios u ON u.id_user = p.autor -- Aquí obtienes el autor del post
                    INNER JOIN categorias c ON c.id_categoria = p.categoria 
                    WHERE s.navegante = ${req.params.id}
                    UNION ALL
                    SELECT pb.id_post,pb.descripcion,u2.usuario,u2.imagen,pb.imagen,c2.name_categoria,sp.navegante FROM save_postP sp
                    INNER JOIN posts_publicidad pb ON pb.id_post = sp.post
                    INNER JOIN usuarios u2 ON u2.id_user = pb.autor -- Aquí obtienes el autor del post
                    INNER JOIN categorias c2 ON c2.id_categoria = pb.categoria 
                    WHERE sp.navegante = ${req.params.id}`;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });

    });
    // Llama la info del usuario
    router.get('/getdescripcion:id',(req, res) => {
        const {id} = req.params;
        let obtener =` select usuario, imagen, descripcion  from  usuarios inner join descripcion on id_user = usuarios where id_user =  ${req.params.id} ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });

    });
    
     //Se usa agarrar un usuario por su id
     router.get('/PostPerfil:id',(req, res) => {
        const {id} = req.params;
        let obtener =`SELECT p.id_post,p.descripcion,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria FROM  posts_generales p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria and  u.id_user=?` ;
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });

    });
    // agarra la descripcion personalizada del usuario
    router.get('/PostDes:id',(req, res) => {
        const {id} = req.params;
        let obtener =` SELECT  u.usuarios,d.descripcion FROM descripcion d , usuarios u where  d.usuarios = u.id_user and d.usuarios  = ${req.params.id} ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });

    });
   
    //Actualiza el perfil del usuario
    router.post('/update2/:id', upload.single('imagen'), (req, res) => {
        const { id } = req.params;
        const { usuario, descripcion } = req.body;
        let path_value = req.body.imagen; 
        if (req.file) {
          const imagePath = req.file;
          path_value = imagePath.filename; 
        }
        const query = `UPDATE usuarios SET usuario = '${usuario}', descripcion = '${descripcion}', imagen = '${path_value}'  WHERE id_user = ${id};`;
        conn.query(query, (error, filas) => {
          if (error) {
            res.json({ status: 0, mensaje: 'Error al actualizar el perfil', datos: [] });
          } else {
            res.json({ status: 1, mensaje: 'Perfil actualizado con éxito', datos: filas });
          }
        });
      });
    //ADMIN
    router.delete('/borrarPosts/:id', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM posts_generales WHERE id_post = ${req.params.id}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.get('/modificar1/:id',(req, res) => {
        const {id} = req.params;
        let obtener =` select descripcion, imagen,autor,categoria  from posts_generales where id_post = ${req.params.id} ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });

    });
    router.post('/update1/:id',(req, res) => {
        const {id} = req.params;
        let obtener =` update posts_generales set descripcion = '${req.body.descripcion}', imagen  = '${req.body.imagen}' , categoria = '${req.body.categoria}' where id_post = ${req.params.id}; ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });

    });
    // Ruta para procesar y extraer colores dominantes de una imagen
    router.post('/extract-colors', async (req, res) => {
        const imageUrl = req.body.imageUrl; 
        try {
        const palette = await Vibrant.from(imageUrl).getPalette(); 
        res.json(palette); 
        } catch (error) {
        console.error('Error al obtener los colores:', error);
        res.status(500).json({ error: 'Error al obtener los colores' });
        }
    });
    router.get('/filtrar', (req, res) => {
        const colorSeleccionado = req.query.color;
        const query = 'SELECT * FROM post_generales WHERE color_vibrant = ? OR color_muted = ?';
        db.query(query, [colorSeleccionado, colorSeleccionado], (err, results) => {
            if (err) throw err;
            res.json(results); 
        });
    });

    function obtenerPrendaAleatoria(tabla, callback) {
        const query = `SELECT * FROM ${tabla} ORDER BY RAND() LIMIT 1`;
        conn.query(query, (err, result) => {
          if (err) throw err;
          callback(result[0]);
        });
      }
      router.get('/generar-look', (req, res) => {
        let look = {};
        obtenerPrendaAleatoria('tops', (top) => {
          look.top = top;
          obtenerPrendaAleatoria('pantalones', (pantalon) => {
            look.pantalon = pantalon;
            obtenerPrendaAleatoria('accesorios', (accesorio) => {
              look.accesorio = accesorio;
              obtenerPrendaAleatoria('zapatos', (zapato) => {
                look.zapato = zapato;
                obtenerPrendaAleatoria('chaquetas', (chaqueta) => {
                    look.chaqueta= chaqueta;
                    res.json(look);
                  });
              });
            });
          });
        });
      });

      function obtenerPrendaAleatoriaM(tabla, callback) {
        const query = `SELECT * FROM ${tabla} ORDER BY RAND() LIMIT 1`;
        conn.query(query, (err, result) => {
          if (err) throw err;
          callback(result[0]);
        });
      }

      router.get('/generar-lookM', (req, res) => {
        let looks = {};
        obtenerPrendaAleatoriaM('topsH', (topsH) => {
          looks.topM = topsH;
          obtenerPrendaAleatoriaM('pantalonesH', (pantalonH) => {
            looks.pantalonM = pantalonH;
            obtenerPrendaAleatoriaM('accesoriosH', (accesorioH) => {
              looks.accesorioM = accesorioH;
              obtenerPrendaAleatoriaM('zapatosH', (zapatoH) => {
                looks.zapatoM = zapatoH;
                obtenerPrendaAleatoriaM('chaquetasH', (chaquetaH) => {
                    looks.chaquetaM= chaquetaH;
                    res.json(looks);
                  });
              });
            });
          });
        });
      });

      router.get('/obtenerprenda',(req, res) => {
        let obtener = 'SELECT imagen FROM  posts_generales';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de tendencias obtenida con exito", datos: filas});
            }
        });
        
    });

    router.get('/prendas',(req, res) => {
        let obtener =  'SELECT url_imagen FROM  prendas';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de tendencias obtenida con exito", datos: filas});
            }
        });
        
    });

    //----------------------------------- AREA PARA ARTICULOS--------------------------------------------------------------------

    router.post('/agregarART', upload.single('imagen'), async (req, res) => {
        const {titulo,contenido, autor, categoria} = req.body;
        const imagenFilename = req.file ? req.file.filename : "";
        const query = `INSERT INTO posts_articulos (titulo,contenido,imagen,autor,categoria) VALUES (?,?,?,?,?)`;
        const values = [titulo,contenido,imagenFilename, autor, categoria];
        conn.query(query, values, (error, filas) => {
        if (error) {
            console.error(error);
            return res.json({ status: 0, mensaje: "Error al insertar en la BD", datos: [] });
        } else {
            return res.json({ status: 1, mensaje: "Artiulo ingresado con exito", datos: filas });
        }
        });
    });

    //Se usa agarrar todos los articulos 
    router.get('/obtenerART',(req, res) => {
        let obtener = 'SELECT p.id_post,p.titulo,p.contenido,p.imagen,u.id_user,u.usuario,c.id_categoria,c.name_categoria FROM  posts_articulos p, usuarios u , categorias c where p.autor=u.id_user and p.categoria = c.id_categoria order by p.id_post ASC';
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de tendencias obtenida con exito", datos: filas});
            }
        });
    });

    //Devolver los comentarios 
    router.get('/getComentariosART/:id',(req, res) => {
        const {id} = req.params;
        let obtener = 'SELECT c.navegante ,u.usuario, c.comments, c.id_comment FROM  posts_articulos p, usuarios u , comments_articulos c where p.id_post = c.post and c.navegante = u.id_user and p.id_post = ?';
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de comentarios obtenida", datos: filas});
            }
        });
    });
    //Devolver la cantidad de likes de los Post Generales
    router.get('/countLikeART/:id',(req, res) => {
        const {id} = req.params;
        let obtener = 'SELECT count(*) as cantidad from likes_articulos l ,posts_articulos p where p.id_post = l.post and p.id_post =?';
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de cantidad likes obtenida con exito", datos: filas});
            }
        });   
    });
    //Guardar los likes del los usuarios logueados
    router.post('/likesART',(req, res) => {
        let query = `insert into likes_articulos(post,navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Like insertado con éxito", datos: []});
            }
        });
    });
    //Insertar los guardados de los usuarios logueados
    router.post('/saveART',(req, res) => {
        let query = `insert into save_articulos(post,navegante) VALUES('${req.body.post}','${req.body.navegante}')`;
        conn.query(query, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Post guardada con éxito", datos: []});
            }
        });
    });
    //Inserta los comentarios de los usuarios logueados
    router.post('/commentsART',(req, res) => {
        const { post, navegante} = req.body;
        if (filter.isProfane(req.body.comments)) {
            return res.json({status: 0, mensaje: "Comentario inapropiado detectado.", datos: []});
        }else{
            let query = `INSERT INTO comments_articulos(post, navegante, comments) VALUES('${post}', '${navegante}', '${req.body.comments}')`;
            conn.query(query, (error,filas) =>{
                if(error){
                    res.json({status: 0, mensaje: "No hay valores para insertar en la BD", datos: []});
                }else{
                    res.json({status: 1, mensaje: "Comentario insertado con éxito", datos: []});
                }
            });
        }   
    });

    // parte nueva 

    router.delete('/borrarLikesART/:id/:id2', (req, res) => {
        const {id} = req.params.id;
        let consulta = `DELETE FROM likes_articulos WHERE post = ${req.params.id} and navegante = ${req.params.id2}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.delete('/borrarSavesART/:id/:id2', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM save_articulos WHERE post = ${req.params.id} and navegante = ${req.params.id2}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
    router.post('/updateComART/:id3',(req, res) => {
        //res.json({ mensaje: "Ejecutando metodo get"});
        const {id} = req.params;
        let obtener =` update comments_articulos set post ='${req.body.post}' ,navegante ='${req.body.navegante}' , comments = '${req.body.comments}' where id_comment = ${req.params.id3}; ` ;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Comentario modificado con exito", datos: filas});
            }
        });
    });
    router.delete('/borrarCommentART/:id/:id2/:id3', (req, res) => {
        const {id} = req.params;
        let consulta = `DELETE FROM comments_articulos WHERE post = ${req.params.id} and navegante = ${req.params.id2} and id_comment = ${req.params.id3}`;
        console.log(consulta);
        conn.query(consulta, (err, filas) => {
            if (err) {
                res.json({status: 0, mensaje: "Error en la eliminacion", datos: []});
            } else {
                res.json({status: 1, mensaje: "Dato eliminado satisfactoriamente", datos:[]});
            }
        });
    });
     router.get('/getCommentART/:id/:id2/:id3',(req, res) => {
        const {id} = req.params;
        let obtener = `SELECT id_comment, post,navegante,comments FROM  comments_articulos  where post = ${req.params.id} and navegante = ${req.params.id2} and id_comment = ${req.params.id3}`;
        conn.query(obtener,[id], (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de comentarios obtenida con exito", datos: filas});
            }
        });
    });

    //LLama a las publicaciones guardadas por el usuario
    router.get('/getsaveA/:id',(req, res) => {
        const {id} = req.params;
        let obtener =`SELECT p.id_post,p.titulo, p.contenido, u.usuario,p.imagen, c.name_categoria, s.navegante AS usuario_logueado -- Usuario logueado
                    FROM save_articulos s
                    INNER JOIN posts_articulos p ON p.id_post = s.post
                    INNER JOIN usuarios u ON u.id_user = p.autor -- Aquí obtienes el usuario que creó la publicación
                    INNER JOIN categorias c ON c.id_categoria = p.categoria
                    WHERE s.navegante = ${req.params.id};`;
        console.log(obtener);
        conn.query(obtener, (error,filas) =>{
            if(error){
                res.json({status: 0, mensaje: "No hay valores en la BD", datos: []});
            }else{
                res.json({status: 1, mensaje: "Info de ropa obtenida con exito", datos: filas});
            }
        });
    });   

module.exports = router;
