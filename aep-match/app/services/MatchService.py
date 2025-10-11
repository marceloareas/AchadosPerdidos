import ollama
from ..utils.similaridade import sim_cosseno

class MatchService:

    def _calcular_similaridade_para_par(self, item_pivo, item_target):
        
        texto_pivo = f"{item_pivo['nome']} {item_pivo['descricao']} {' '.join(item_pivo['categorias'])} {item_pivo.get('localizacao', '')}"
        texto_target = f"{item_target['nome']} {item_target['descricao']} {' '.join(item_target['categorias'])} {item_target.get('localizacao', '')}"

        emb_pivo = ollama.embed(model="embeddinggemma:latest", input=texto_pivo)['embeddings']
        emb_target = ollama.embed(model="embeddinggemma:latest", input=texto_target)['embeddings']

        score = sim_cosseno(emb_pivo, emb_target)

        nota = score * 10

        return nota
    
    def find_matches(self, item_pivo, itens_target, limite=7.0):

        ids_matches = []
        notas_matches = []

        for item in itens_target:
            nota = self._calcular_similaridade_para_par(item_pivo, item)
            
            if nota >= limite:
                ids_matches.append(item['id'])
                notas_matches.append(round(nota, 2))

        return [{
            "id_ItemPivo": item_pivo['id'],
            "ids_PossiveisMatches": ids_matches,
            "notas_PossiveisMatches": notas_matches
        }]
