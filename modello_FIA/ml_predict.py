#import librerie necessarie
import pandas as pd
import pickle
import sys

def predict(file_name):
    #viene deserializzato il modello
    loaded_module = pickle.load(open('../Modello_FIA/trained_model.sav','rb'))
    #lettura del file csv contenente i dati del paziente da predire
    patient = pd.read_csv(file_name)

    #drop delle colonne non necessarie alla predizione come id, nome, cognome, ...
    patient.drop(['_id','nome','cognome','cf','sesso','dataNascita','telefono','email','priorita'], inplace=True, axis=1)

    #predizione e restituzione del valore predetto al chiamante
    pred = loaded_module.predict(patient)
    
    if(pred[0] == "High"):
        print("Alta")
    elif(pred[0] == "Medium"):
        print("Media")
    elif(pred[0] == "Low"):
        print("Bassa")

#chiamo la funzione iniziale (usato solo per testare funzionamento del modello e lettura del csv con i dati da predire)
# pred = predict()
# print(f'La predizione è: {pred}')

if __name__ == "__main__":
    predict(sys.argv[1])
    