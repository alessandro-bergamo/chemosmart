#import libreria per plottare i dati e libreria pandas per leggere il dataset
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

def plotting_priorities(data):
    sns.set_style('whitegrid')
    sns.histplot(data=data, x='Level')

    plt.title('Numero di pazienti per livello di priorita')
    plt.ylabel('Numero di casi')
    plt.xlabel('Livello di priorità')

    plt.show()

def plotting_priorities_on_ages(data):
    #viene scremato il dataset selezionando solamente i pazienti con priorità elevata
    high_level_patients = data.loc[data['Level'] == 'High']
    medium_level_patients = data.loc[data['Level'] == 'Medium']
    low_level_patients = data.loc[data['Level'] == 'Low']

    #set stile del grafico (mostra grid nel grafico)
    sns.set_style('whitegrid')

    #grafico che mostra rapporto priorità alta/età
    sns.histplot(data=high_level_patients, x='Age')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità alta per range di età")
    plt.ylabel("Numero di casi")
    plt.xlabel("Età pazienti")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto priorità media/età
    sns.histplot(data=medium_level_patients, x='Age')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità media per range di età")
    plt.ylabel("Numero di casi")
    plt.xlabel("Età pazienti")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto priorità bassa/età
    sns.histplot(data=low_level_patients, x='Age')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità bassa per range di età")
    plt.ylabel("Numero di casi")
    plt.xlabel("Età pazienti")

    #viene mostrato il grafico
    plt.show()

#caricamento del dataset
data = pd.read_csv('./dataset.csv')

#richiamo delle varie funzioni (togliere il commento dalla funzione che si vuole mostrare)

#funzione che mostra per ogni livello di priorità il numero di casi nel dataset
plotting_priorities(data)

#funzione che mostra rapporto età/priorità
plotting_priorities_on_ages(data)