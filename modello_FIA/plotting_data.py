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

def plotting_priorities_on_alcohol_use(data):
    high_level_patients = data.loc[data['Level'] == 'High']
    medium_level_patients = data.loc[data['Level'] == 'Medium']
    low_level_patients = data.loc[data['Level'] == 'Low']

    #grafico che mostra rapporto fra uso di alcool/priorità alta
    sns.histplot(data=high_level_patients, x='Alcohol use')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità alta per indice uso di alcool")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice uso di alcool")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto fra uso di alcool/priorità media
    sns.histplot(data=medium_level_patients, x='Alcohol use')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità media per indice uso di alcool")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice uso di alcool")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto fra uso di alcool/priorità bassa
    sns.histplot(data=low_level_patients, x='Alcohol use')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità bassa per indice uso di alcool")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice uso di alcool")

    #viene mostrato il grafico
    plt.show()

def plotting_priorities_on_genetic_risk(data):
    high_level_patients = data.loc[data['Level'] == 'High']
    medium_level_patients = data.loc[data['Level'] == 'Medium']
    low_level_patients = data.loc[data['Level'] == 'Low']

    #grafico che mostra rapporto fra fattore di rischio familiare/priorità alta
    sns.histplot(data=high_level_patients, x='Genetic Risk')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità alta per fattore di rischio familiare")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice fattore di rischio familiare")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto fra fattore di rischio familiare/priorità media
    sns.histplot(data=medium_level_patients, x='Genetic Risk')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità media per fattore di rischio familiare")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice fattore di rischio familiare")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto fra fattore di rischio familiare/priorità bassa
    sns.histplot(data=low_level_patients, x='Genetic Risk')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità bassa per fattore di rischio familiare")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice fattore di rischio familiare")

    #viene mostrato il grafico
    plt.show()

def plotting_priorities_on_smoking(data):
    high_level_patients = data.loc[data['Level'] == 'High']
    medium_level_patients = data.loc[data['Level'] == 'Medium']
    low_level_patients = data.loc[data['Level'] == 'Low']

    #grafico che mostra rapporto fra esposizione a fumo attivo (fumatore)/priorità alta
    sns.histplot(data=high_level_patients, x='Smoking')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità alta per esposizione a fumo attivo (fumatore)")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice di esposizione a fumo attivo (fumatore)")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto fra esposizione a fumo attivo (fumatore)/priorità media
    sns.histplot(data=medium_level_patients, x='Smoking')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità media per esposizione a fumo attivo (fumatore)")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice di esposizione a fumo attivo (fumatore)")

    #viene mostrato il grafico
    plt.show()

    #grafico che mostra rapporto fra esposizione a fumo attivo (fumatore)/priorità bassa
    sns.histplot(data=low_level_patients, x='Smoking')

    #set del titolo del grafico, label asse y e asse x
    plt.title("Numero di pazienti a priorità bassa per esposizione a fumo attivo (fumatore)")
    plt.ylabel("Numero di casi")
    plt.xlabel("Indice di esposizione a fumo attivo (fumatore)")

    #viene mostrato il grafico
    plt.show()

#caricamento del dataset
data = pd.read_csv('./dataset.csv')

#richiamo delle varie funzioni (togliere il commento dalla funzione che si vuole mostrare)

#funzione che mostra per ogni livello di priorità il numero di casi nel dataset
plotting_priorities(data)

#funzione che mostra rapporto età/priorità
plotting_priorities_on_ages(data)

#funzione che mostra rapporto uso alcol/priorità
plotting_priorities_on_alcohol_use(data)

#funzione che mostra rapporto fattore di rischio familiare/priorità
plotting_priorities_on_genetic_risk(data)

#funzione che mostra rapporto fumo attivo/priorità
plotting_priorities_on_smoking(data)