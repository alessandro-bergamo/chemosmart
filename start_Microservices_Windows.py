import os
import subprocess

# definisci la directory base in cui cercare i microservizi
base_dir = os.path.dirname(os.path.abspath(__file__))

# scandisci le cartelle all'interno della directory base
for folder in os.listdir(base_dir):
    # costruisci il percorso completo della cartella corrente
    current_dir = os.path.join(base_dir, folder)
    # controlla se la cartella contiene un file package.json
    if os.path.exists(os.path.join(current_dir, "package.json")):
        # esegui il comando npm start nella cartella corrente
        subprocess.Popen(f"start cmd /k npm start", shell=True, cwd=current_dir)