package br.com.cefet.achadosperdidos.domain.enums;


import lombok.Getter;

public enum TipoFinalizacaoMatch {
    CONCLUSAO_MATCH("CONCLUSAO_MATCH"),
    CONCLUSAO_OUTRO_MATCH("CONCLUSAO_OUTRO_MATCH");

    @Getter
    private final String enumeratedString;

    TipoFinalizacaoMatch(String enumeratedString) { this.enumeratedString = enumeratedString; }

    public static TipoFinalizacaoMatch fromString(String enumString){
        for(TipoFinalizacaoMatch constant : TipoFinalizacaoMatch.values()){
            if(enumString.equalsIgnoreCase(constant.getEnumeratedString())){
                return constant;
            }
        }
        throw new EnumConstantNotPresentException(TipoFinalizacaoMatch.class, enumString);
    }
}

