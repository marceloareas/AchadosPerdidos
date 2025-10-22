import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import style from "./Home.module.scss";
import { FiPlus } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { Grid } from "@mui/material";
import ItemCard from "../../components/ui/itemCard/ItemCard";
import useItemStore from "../../store/item.js";
const Home = () => {
  const navigate = useNavigate();

  const itemsStore = useItemStore();
  const { getItemsRecentlyReturned } = itemsStore;
  const { itemsReturned } = itemsStore;
  React.useEffect(() => {
    getItemsRecentlyReturned();
  }, []);

  // dados mockados - substituir pela API depois
  // const latestItems = [
  //   {
  //     itemType: "returned",
  //     category: "Chaves",
  //     title: "Chaveiro Vermelho",
  //     location: "Biblioteca Central",
  //     personName: "Ana Carolina", //nome do usuario que cadastrou o item
  //     description: "Achei um chaveiro vermelho com 6 chaves na biblioteca."
  //   },
  //   {
  //     itemType: "returned",
  //     category: "Carteiras",
  //     title: "Carteira Preta",
  //     location: "Sala 203",
  //     personName: "Vinicius Saidy",
  //     description: "Carteira preta de couro com documentos e cartões."
  //   },
  //   {
  //     itemType: "returned",
  //     category: "Eletrônicos",
  //     title: "Fone Bluetooth",
  //     location: "Laboratório de Informática",
  //     personName: "Caio Souza",
  //     description: "Fone bluetooth preto sem marca visível."
  //   },
  //    {
  //     itemType: "returned",
  //     category: "Eletrônicos",
  //     title: "Carregador USB-C",
  //     location: "Corredor do pavilhão 1",
  //     personName: "Flavio Alecio",
  //     description: "Carregador branco tipo usb-c com adesivo de nuvem."
  //   }
  // ];

  return (
    <Layout>
      <section className={style.section_home_above}>
        <h1>Achados e Perdidos</h1>
        <h2>CEFET/RJ - Campus Maracanã</h2>

        <button
          className={style.btn_home}
          onClick={() => navigate("/add-item?type=lost")}
        >
          <FiPlus className={style.icon_plus_btn_home} />
          <div className={style.text_btn_home}>
            <h3>Cadastrar Item Perdido</h3>
            <h5>Perdeu algo? Cadastre aqui</h5>
          </div>
        </button>

        <button
          className={style.btn_home}
          onClick={() => navigate("/add-item?type=found")}
        >
          <FaSearch className={style.icon_search_btn_home} />
          <div className={style.text_btn_home}>
            <h3>Cadastrar Item Encontrado</h3>
            <h5>Achou algo? Cadastre aqui</h5>
          </div>
        </button>
      </section>

      <section className={style.section_home_below}>
        <h3 className={style.lastReturnedItems}>Últimos itens devolvidos</h3>
        <Grid container spacing={2} direction="column">
          {itemsReturned.map((item, index) => (
            <Grid item key={index}>
              <ItemCard
                itemType={"RECUPERADO"}
                category={[item.categoria]}
                title={item.nome}
                location={item.localizacao}
                // personName={item.personName} //mudar pra nome do usuario que cadastrou o item
                description={item.descricao}
                showDescription={false}
                showOptions={false}
              />
            </Grid>
          ))}
        </Grid>
      </section>
    </Layout>
  );
};

export default Home;
