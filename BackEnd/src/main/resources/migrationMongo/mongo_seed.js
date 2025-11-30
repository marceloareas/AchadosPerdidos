db.mensagens.insertMany([
  {
    tipo: "TEXTO",
    chatId: 1,
    dataEnvio: ISODate("2025-10-05T14:10:00Z"),
    remetenteId: 1,
    conteudo: "Olá! Vi que encontramos um possível match entre nossos itens.",
  },
  {
    tipo: "TEXTO",
    chatId: 1,
    dataEnvio: ISODate("2025-10-05T14:12:30Z"),
    remetenteId: 4,
    conteudo:
      "Oi! Acho que o iPhone que você perdeu pode ser o que eu encontrei.",
  },
  {
    tipo: "TEXTO",
    chatId: 1,
    dataEnvio: ISODate("2025-10-05T14:15:00Z"),
    remetenteId: 1,
    conteudo: "Ele tem capa preta e um arranhão pequeno na tela?",
  },
  {
    tipo: "TEXTO",
    chatId: 1,
    dataEnvio: ISODate("2025-10-05T14:16:20Z"),
    remetenteId: 4,
    conteudo: "Sim! Exatamente isso!",
  },
]);

//no git bash, coloque docker cp BackEnd/src/main/resources/migrationMongo/mongo_seed.js achados_mongo:/mongo_seed.js
// e depois execute tambem docker exec -it achados_mongo mongosh -u achados-perdidos -p Ue6TIdYjpvpBv4k2 --authenticationDatabase admin //mongo_seed.js
