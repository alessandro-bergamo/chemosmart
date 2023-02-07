#import librerie necessarie
import pandas as pd
import numpy as np
from sklearn.model_selection import KFold
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB

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

        #stampa per verificare i vari slice di dataset ottenuti
        print("train dataset e pred values")
        print(X_train,y_train)

        print("test dataset e pred values")
        print(X_test,y_test)

#chiamo la funzione iniziale
training_and_testing_models()