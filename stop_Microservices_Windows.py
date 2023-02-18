import os
import psutil

# Trova tutti i processi node.exe in esecuzione
output = os.popen('tasklist /FI "IMAGENAME eq node.exe"').read()
lines = output.strip().split('\n')[3:]
pids = [int(line.split()[1]) for line in lines]

# Termina tutti i processi node.exe
for pid in pids:
    os.system(f'taskkill /F /PID {pid}')
    print(f"Processo node.exe con PID {pid} terminato")