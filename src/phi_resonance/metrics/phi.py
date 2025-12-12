import numpy as np  
import scipy.stats as stats  
from scipy.spatial.distance import jensenshannon  
  
class PhiMetric:  
    """Metrica F per misurare la risonanza parametrica. >> src\phi_resonance\metrics\phi.py && echo. >> src\phi_resonance\metrics\phi.py && echo     F misura la divergenza Jensen-Shannon tra le distribuzioni >> src\phi_resonance\metrics\phi.py && echo     dei parametri del modello e dei dati di input. >> src\phi_resonance\metrics\phi.py && echo     """  
  
    def __init__(self, n_bins=30, epsilon=1e-12):  
        """ >> src\phi_resonance\metrics\phi.py && echo         Args: >> src\phi_resonance\metrics\phi.py && echo             n_bins: Numero di bin per l'istogramma >> src\phi_resonance\metrics\phi.py && echo             epsilon: Valore piccolo per stabilita numerica >> src\phi_resonance\metrics\phi.py && echo         """  
        self.n_bins = n_bins  
        self.epsilon = epsilon  
  
    def _winsorize(self, data, lower_percentile=1, upper_percentile=99):  
        """Applica winsorization per rimuovere outliers."""  
        lower = np.percentile(data, lower_percentile)  
        upper = np.percentile(data, upper_percentile)  
        return np.clip(data, lower, upper)  
  
    def _compute_shared_bin_edges(self, param_dist, data_dist):  
        """Calcola bin edges condivisi per entrambe le distribuzioni."""  
        # Combina e winsorizza entrambe le distribuzioni  
        combined = np.concatenate([param_dist, data_dist])  
        combined_winsorized = self._winsorize(combined)  
  
        # Calcola i bin edges sull'intervallo combinato  
        min_val = np.min(combined_winsorized)  
        max_val = np.max(combined_winsorized)  
  
        # Aggiungi un piccolo margine  
        margin = 0.01 * (max_val - min_val)  
        min_val -= margin  
        max_val += margin  
  
        return np.linspace(min_val, max_val, self.n_bins + 1)  
  
    def _jsd(self, p, q):  
        """Calcola la Jensen-Shannon Divergence."""  
        # Normalizza a distribuzioni di probabilita  
        p_norm = p / np.sum(p)  
        q_norm = q / np.sum(q)  
  
        # Aggiungi epsilon per stabilita numerica  
        p_norm = np.clip(p_norm, self.epsilon, 1)  
        q_norm = np.clip(q_norm, self.epsilon, 1)  
  
        # Calcola JSD  
        m = 0.5 * (p_norm + q_norm)  
        jsd = 0.5 * (stats.entropy(p_norm, m) + stats.entropy(q_norm, m))  
  
        return jsd  
  
    def compute(self, param_dist, data_dist):  
        """ >> src\phi_resonance\metrics\phi.py && echo         Calcola la metrica F. >> src\phi_resonance\metrics\phi.py && echo. >> src\phi_resonance\metrics\phi.py && echo         Args: >> src\phi_resonance\metrics\phi.py && echo             param_dist: Distribuzione dei parametri (array-like) >> src\phi_resonance\metrics\phi.py && echo             data_dist: Distribuzione dei dati (array-like) >> src\phi_resonance\metrics\phi.py && echo. >> src\phi_resonance\metrics\phi.py && echo         Returns: >> src\phi_resonance\metrics\phi.py && echo             float: Valore della metrica F (0 = perfetta risonanza) >> src\phi_resonance\metrics\phi.py && echo         """  
        try:  
            # Converti a numpy array se necessario  
            param_dist = np.asarray(param_dist, dtype=np.float64).flatten()  
            data_dist = np.asarray(data_dist, dtype=np.float64).flatten()  
  
            # Calcola bin edges condivisi  
            bin_edges = self._compute_shared_bin_edges(param_dist, data_dist)  
  
            # Calcola istogrammi  
            param_hist, _ = np.histogram(param_dist, bins=bin_edges)  
            data_hist, _ = np.histogram(data_dist, bins=bin_edges)  
  
            # Calcola JSD  
            phi_value = self._jsd(param_hist, data_hist)  
  
            return float(phi_value)  
  
        except Exception as e:  
            print(f"Errore nel calcolo di F: {e}")  
            raise 
