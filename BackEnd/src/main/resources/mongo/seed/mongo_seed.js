db = db.getSiblingDB("achados_chat");

db.createCollection("mensagens");
// use("achados_chat");

db.mensagens.deleteMany({});

db.mensagens.insertMany([
  {
    tipo: "TEXTO",
    chatId: NumberLong(1),
    dataEnvio: ISODate("2025-10-05T14:10:00Z"),
    remetenteId: NumberLong(1),
    conteudo: "Olá! Vi que encontramos um possível match entre nossos itens.",
  },
  {
    tipo: "TEXTO",
    chatId: NumberLong(1),
    dataEnvio: ISODate("2025-10-05T14:12:30Z"),
    remetenteId: NumberLong(4),
    conteudo:
      "Oi! Acho que o iPhone que você perdeu pode ser o que eu encontrei.",
  },
  {
    tipo: "TEXTO",
    chatId: NumberLong(1),
    dataEnvio: ISODate("2025-10-05T14:15:00Z"),
    remetenteId: NumberLong(1),
    conteudo: "Ele tem capa preta e um arranhão na tela?",
  },
  {
    tipo: "TEXTO",
    chatId: NumberLong(1),
    dataEnvio: ISODate("2025-10-05T14:16:20Z"),
    remetenteId: NumberLong(4),
    conteudo: "Sim, exatamente!",
  },
]);

//se não rodar ao inicializar o banco, faça
//no git bash, coloque docker cp BackEnd/src/main/resources/mongo/seed/mongo_seed.js achados_mongo:/mongo_seed.js
// e depois execute tambem docker exec -it achados_mongo mongosh -u achados-perdidos -p Ue6TIdYjpvpBv4k2  //mongo_seed.js
