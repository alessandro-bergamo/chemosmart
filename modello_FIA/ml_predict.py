#import librerie necessarie
import pandas as pd
import pickle

def predict(file_name):
    #viene deserializzato il modello
    loaded_module = pickle.load(open('trained_model.sav','rb'))

    #lettura del file csv contenente i dati del paziente da predire
    patient = pd.read_csv(file_name)

    #drop delle colonne non necessarie alla predizione come id, nome, cognome, ...
    patient.drop(['_id','nome','cognome','cf','sesso','dataNascita','telefono','email'], inplace=True, axis=1)

    #predizione e restituzione del valore predetto al chiamante
    prediction = loaded_module.predict(patient)
    return prediction

#chiamo la funzione iniziale (usato solo per testare funzionamento del modello e lettura del csv con i dati da predire)
pred = predict('predict_test.csv')
print(f'La predizione è: {pred}')