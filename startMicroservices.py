import subprocess

microservizio1 = subprocess.Popen(["npm", "start"], cwd="chemosmart-core", stdout=subprocess.PIPE, stderr=subprocess.PIPE)
microservizio2 = subprocess.Popen(["npm", "start"], cwd="chemosmart-gestioneAppuntamenti", stdout=subprocess.PIPE, stderr=subprocess.PIPE)
microservizio3 = subprocess.Popen(["npm", "start"], cwd="chemosmart-gestione-terapia", stdout=subprocess.PIPE, stderr=subprocess.PIPE)
microservizio4 = subprocess.Popen(["npm", "start"], cwd="chemosmart-gestione-farmaci", stdout=subprocess.PIPE, stderr=subprocess.PIPE)
microservizio5 = subprocess.Popen(["npm", "start"], cwd="chemosmart-gestionePazienti", stdout=subprocess.PIPE, stderr=subprocess.PIPE)