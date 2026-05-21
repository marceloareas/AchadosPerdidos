import ollama
from ..utils.similaridade import sim_cosseno

class MatchService:

    def _calcular_similaridade_para_par(self, item_pivo, item_target):
        # 1. Filtro 'Hard' por Categoria:
        # Se os itens não tiverem nenhuma categoria em comum, retornamos 0 imediatamente.
        # Isso evita que nomes parecidos de categorias diferentes (caneca vs caneta) deem match.
        categorias_pivo = set(item_pivo.get('categorias', []))
        categorias_target = set(item_target.get('categorias', []))
        
        if not categorias_pivo.intersection(categorias_target):
            return 0.0

        # 2. Construção do texto com descrição (Contexto Semântico)
        # Adicionamos prefixos para ajudar o modelo a separar o que é nome do que é detalhe.
        desc_pivo = item_pivo.get('descricao', '')
        desc_target = item_target.get('descricao', '')

        texto_pivo = (
            f"Item: {item_pivo['nome']}. "
            f"Descrição: {desc_pivo}. "
            f"Categorias: {', '.join(item_pivo['categorias'])}."
        )
        
        texto_target = (
            f"Item: {item_target['nome']}. "
            f"Descrição: {desc_target}. "
            f"Categorias: {', '.join(item_target['categorias'])}."
        )

        # 3. Geração de Embeddings
        try:
            emb_pivo = ollama.embed(model="embeddinggemma:latest", input=texto_pivo)['embeddings']
            emb_target = ollama.embed(model="embeddinggemma:latest", input=texto_target)['embeddings']

            score = sim_cosseno(emb_pivo, emb_target)
            nota = score * 10
            return nota
        except Exception as e:
            print(f"Erro ao gerar embedding: {e}")
            return 0.0
    
    def find_matches(self, item_pivo, itens_target, limite=8.0):
        ids_matches = []
        notas_matches = []

        for item in itens_target:
            # Ignora se for o mesmo item
            if item['id'] == item_pivo['id']:
                continue

            nota = self._calcular_similaridade_para_par(item_pivo, item)
            
            print(f"[DEBUG MATCH-API] Pivô: {item_pivo['nome']} | Alvo: {item['nome']} | Nota: {nota}")

            if nota >= limite:
                ids_matches.append(item['id'])
                notas_matches.append(round(nota, 2))

        return {
            "id_ItemPivo": item_pivo['id'],
            "ids_PossiveisMatches": ids_matches,
            "notas_PossiveisMatches": notas_matches
        }