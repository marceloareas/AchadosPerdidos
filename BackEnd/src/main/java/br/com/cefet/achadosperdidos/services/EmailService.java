package br.com.cefet.achadosperdidos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailRecuperacao(String emailDestino, String token) {
        try {
            System.out.println("--- 📧 Iniciando processo de envio para: " + emailDestino + " ---");
            
            SimpleMailMessage message = new SimpleMailMessage();
            // Deve ser o mesmo e-mail configurado no seu MAIL_USERNAME
            message.setFrom("tucolimacarneiro@gmail.com"); 
            message.setTo(emailDestino);
            message.setSubject("Recuperação de Senha - Achados e Perdidos");
            
            String link = "http://localhost:5173/reset-password?token=" + token;
            message.setText("Olá!\n\nVocê solicitou a recuperação de senha.\n" +
                           "Clique no link abaixo para criar uma nova senha:\n\n" +
                           link + "\n\n" +
                           "Se você não solicitou isso, ignore este e-mail.\n" +
                           "O link expira em 1 hora.");

            mailSender.send(message);
            System.out.println("✅ Sucesso: E-mail aceito pelo servidor SMTP do Google!");

        } catch (Exception e) {
            System.err.println("❌ ERRO NO EMAIL_SERVICE: " + e.getMessage());
            // Lançamos a exceção para que o AuthController saiba que falhou
            throw e; 
        }
    }
}