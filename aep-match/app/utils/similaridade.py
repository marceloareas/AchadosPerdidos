import numpy as np

# Função para calcular similaridade cosseno
def sim_cosseno(vec1, vec2):
    vec1 = np.array(vec1).flatten()  # transforma em 1D
    vec2 = np.array(vec2).flatten()  # transforma em 1D

    # Aplica a fórmula: Produto Escalar / (Norma de vec1 * Norma de vec2)
    # O resultado vai de [-1, 1]
    # -1 simboliza que os vetores possuem sentidos opostos
    # 0 simboliza que os vetores não possuem relação
    # 1 simboliza que os vetores são identicos
    return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))) 