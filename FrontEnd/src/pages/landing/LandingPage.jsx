import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { Search, Plus, MessageCircle, Shield } from "lucide-react";
import Header from "../../components/header/Header";
import CustomButton from "../../components/ui/button/CustomButton";
import { Card, CardContentWrapper, CardTitle, CardDescription } from "../../components/ui/card/Card";
import styles from "./Landing.module.scss";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Plus, title: "Cadastre Itens", description: "Perdeu algo? Cadastre rapidamente e facilite o match." },
    { icon: Search, title: "Matches Automáticos", description: "Nosso sistema conecta quem perdeu com quem encontrou." },
    { icon: MessageCircle, title: "Chat Direto", description: "Converse com segurança com quem encontrou ou perdeu." },
    { icon: Shield, title: "Seguro e Confiável", description: "Sistema exclusivo para a comunidade CEFET/RJ." },
  ];

  return (
    <Box className={styles.landingContainer}>
      <Header />

      <Container className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Achados e Perdidos</h1>
        <h2 className={styles.heroSubtitle}>CEFET/RJ - Campus Maracanã</h2>
        <Typography sx={{ color: "#01070cff", mb: 3, maxWidth: 500, mx: "auto" }}>
          Bem-vindo à plataforma que conecta rapidamente itens perdidos e encontrados no campus. Cadastre-se, encontre matches automáticos e entre em contato com segurança.
        </Typography>
        <CustomButton className={styles.ctaButton} onClick={() => navigate("/register")}>
          Cadastrar Agora
        </CustomButton>
      </Container>

      <Container sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" sx={{ color: "#0A497E", fontWeight: "bold" }}>
          Sobre a plataforma
        </Typography>
      </Container>

      <Container className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <Card key={index} className={styles.featureCard}>
            <div className="iconWrapper">
              <feature.icon size={24} color="#0A497E" />
            </div>
            <CardContentWrapper className="cardText">
              <CardTitle className="cardTitle">{feature.title}</CardTitle>
              <CardDescription className="cardDescription">{feature.description}</CardDescription>
            </CardContentWrapper>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default Landing;
