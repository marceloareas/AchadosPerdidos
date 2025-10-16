import React, { useEffect, useInsertionEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import CustomButton from "../../components/ui/button/CustomButton";
import { Box, Typography } from "@mui/material";
import ItemCard from "../../components/ui/itemCard/ItemCard";
import { Plus } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs/Tab.jsx";

import style from "./MeusItens.module.scss";
import useItemStore from "../../store/item.js";
const MeusItens = () => {
  const [activeTab, setActiveTab] = useState("all");

  const { itemsUser, getUserItens } = useItemStore();
  // Mock data for user's items
  useEffect(() => {
    getUserItens();
  }, []);

  const filteredItems = itemsUser.filter((item) => {
    if (activeTab === "all") return true;
    return item.tipo === activeTab;
  });

  return (
    <Layout>
      <section className={style.titleMyItems}>
        <Box className={style.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            Meus Itens
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {itemsUser.length}{" "}
            {itemsUser.length === 1 ? "item cadastrado" : "itens cadastrados"}
          </Typography>
        </Box>
      </section>
      <section className={style.filtro}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className={style.tabs_container}
        >
          <TabsList className={style.tabs_list}>
            <TabsTrigger value="all">Todos ({itemsUser.length})</TabsTrigger>
            <TabsTrigger value="PERDIDO">
              Perdidos ({itemsUser.filter((i) => i.tipo == "PERDIDO").length})
            </TabsTrigger>
            <TabsTrigger value="ACHADO">
              Encontrados ({itemsUser.filter((i) => i.tipo == "ACHADO").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className={style.tabs_content}>
            {filteredItems.length === 0 ? (
              <div className={style.empty_state}>
                <div className={style.empty_icon}>
                  <Plus className={style.icon} />
                </div>
                <h3 className={style.empty_title}>Nenhum item encontrado</h3>
                <p className={style.empty_subtitle}>
                  {activeTab === "all"
                    ? "Você ainda não cadastrou nenhum item"
                    : `Você não tem itens ${activeTab === "PERDIDO" ? "perdidos" : "encontrados"
                    }`}
                </p>
                <CustomButton asChild>Cadastrar Item</CustomButton>
              </div>
            ) : (
              <div className={style.items_list}>
                {filteredItems.map((item) => {
                  const isLost = item.tipo === "PERDIDO" ? "PERDIDO" : "ACHADO";

                  return (
                    <ItemCard
                      key={item.id}
                      itemType={isLost}
                      onClick={() => handleCardClick(item)}
                      title={item.nome}
                      description={item.descricao}
                      location={item.localizacao}
                      category={item.categorias[0].nome}
                      showOptions={true}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

export default MeusItens;
