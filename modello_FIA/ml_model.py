#import librerie necessarie
import pandas as pd
import numpy as np
from sklearn.model_selection import KFold
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
import pickle

def serialize(model):
    #indichiamo il nome del file in cui verra salvato il modello
    file_name = 'trained_model.sav'

    #effettuiamo il dump del modello nel file
    pickle.dump(model, open(file_name,"wb"))

def validation(model,X_test, y_test,i,model_type):
    #viene usato il test set per valutare il classificatore
    pred = model.predict(X_test)

    #calcoliamo matrice di confusione
    matrix = confusion_matrix(y_test, pred)

    #calcoliamo metriche di valutazione
    report = classification_report(y_test, pred)

    if i == 1:
        open_type = "w"
    else:
        open_type = "a"
    
    #scriviamo su un file matrice di confusione ottenuta
    with open(f"./reports/matrix_report_{model_type}.txt",open_type) as f:
        f.write(f"{i} iterazione:\n")
        f.write(f"Matrice di confusione:\n")
        f.write(str(matrix))
        f.write('\n')
    
    #scriviamo su un file le metriche di valutazione ottenute
    with  open(f"./reports/metrics_report_{model_type}.txt",open_type) as f:
        f.write(f"{i} iterazione:\n")
        f.write("\nMetriche di valutazione:")
        f.write(str(report))
        f.write('\n')

def training_and_testing_models():
    #lettura dataset
    df = pd.read_csv('./dataset.csv')

    #drop delle caratteristiche inutili al modello
    df.drop('PatientId', inplace=True ,axis=1)
    df.drop('Gender', inplace=True ,axis=1)

    #setting delle feature
    features = ['Age', 'Air Pollution','Alcohol use','Allergy','Occupational Hazards',
    'Genetic Risk','chronic Lung Disease','Unbalanced Diet','Obesity','Smoking',
    'Passive Smoker','Chest Pain','Coughing of Blood','Fatigue',
    'Weight Loss','Shortness of Breath','Wheezing','Swallowing Difficulty',
    'Clubbing of Finger Nails','Frequent Cold','Dry Cough','Snoring']
    
    #si trasforma il dataframe in un array per poter eseguire lo split della k-fold validation
    df_array = np.array(df)

    #si salva in X il dataframe sulle sole colonne feature
    X = df[features]

    #setting della variabile da predire 
    y = df['Level']

    #setup del valore di k per la kfold validation
    kf = KFold(n_splits=10)
    
    #inizializzo i due modelli su cui effettuare training e testing
    clf = DecisionTreeClassifier()
    gnb = GaussianNB()

    #inizializzo contatore utile per identificare iterazione del metodo kfold
    i = 0

    #ciclo per la kfold validation
    for train_index, test_index in kf.split(df_array):
        i = i+1

        #si ottengono gli array di training e test sulla base degli indici ottenuti dall'iterazione k attuale
        X_train, X_test = X.loc[train_index], X.loc[test_index]
        y_train, y_test = y.loc[train_index], y.loc[test_index]

        #si allenano i due moduli tramite il set di training dell'iterazione k attuale
        clf.fit(X_train,y_train)
        gnb.fit(X_train,y_train)

        #vengono stampate metriche di valutazione dei due modelli sul test dell'iterazione k
        validation(clf,X_test,y_test,i,"clf")
        validation(gnb,X_test,y_test,i,"gnb")
    
    #richiamo la funzione di serializzazione del modello
    serialize(gnb)
    
    #messaggio per notificare che la serializzazione del modello è avvenuta con successo ed il modello è pronto per essere usato altrove
    print("Il modello è stato serializzato! È ora possibile utilizzarlo altrove!")

#chiamo la funzione iniziale
training_and_testing_models()