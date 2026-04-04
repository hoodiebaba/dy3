import subprocess
import os

def main():
    print(os.getcwd())
    # os.chdir("")
    # Specify the directory containing the Python file you want to run
    script_directory = os.getcwd()
    script_directory2 = os.path.join(os.getcwd(),"cx-ixtool","cxix")
    
    # # Specify the name of the Python file you want to run
    script_name = "corn_app.py"
    script_name2 = "main.py"
    script_name3 = "manage.py"
    
    os.chdir(script_directory)
    
    # # Construct the full path to the Python file
    script_path = os.path.join(script_directory, script_name)
    
    print(script_path,"script_path")
    
    # # Check if the file exists
    if os.path.exists(script_path):
        # Run the Python file using subprocess
        # subprocess.run(["python", script_path])
        
        subprocess.Popen(['start', 'cmd', '/k', 'python', script_name], shell=True)
        subprocess.Popen(['start', 'cmd', '/k', 'python', script_name2], shell=True)
        # subprocess.run(["cmd.exe", "/c", "python", script_name2])
    else:
        print(f"The file {script_name} does not exist in {script_directory}.")
        
    
    os.chdir(script_directory2)
    # # Check if the file exists
    script_path2 = os.path.join(script_directory2, script_name3)
    print(script_path2)
    if os.path.exists(script_path2):
        # Run the Python file using subprocess
        # subprocess.run(["python", script_path])
        
        subprocess.Popen(['start', 'cmd', '/k', 'python', script_name3,"runserver"], shell=True)
        # subprocess.run(["cmd.exe", "/c", "python", script_name2])
    else:
        print(f"The file {script_name3} does not exist in {script_directory}.")

if __name__ == "__main__":
    main()
