import os
import psutil

folder_path = r'C:\Users\Luigi\Desktop\progettoIS\chemosmart'

for item in os.listdir(folder_path):
    item_path = os.path.join(folder_path, item)
    if os.path.isdir(item_path) and os.path.isfile(os.path.join(item_path, 'package.json')):
        os.chdir(item_path)
        for process in psutil.process_iter():
            if process.name() == "node.exe":
                process.terminate()
