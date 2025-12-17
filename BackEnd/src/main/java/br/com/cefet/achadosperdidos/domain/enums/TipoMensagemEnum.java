package br.com.cefet.achadosperdidos.domain.enums;

import lombok.Getter;

@Getter
public enum TipoMensagemEnum {
    TEXTO("texto"),
    CONFIRMACAO("confirmacao");

    private String tipoMensagemString;

    TipoMensagemEnum(String tipoMensagemString){
        this.tipoMensagemString = tipoMensagemString;
    }

    public TipoMensagemEnum fromString(String tipoMensagemString){
        for(TipoMensagemEnum constant : TipoMensagemEnum.values()){
            if(tipoMensagemString.equalsIgnoreCase(constant.getTipoMensagemString())){
                return constant;
            }
        }
        throw new EnumConstantNotPresentException(TipoMensagemEnum.class, tipoMensagemString);
    }
}
