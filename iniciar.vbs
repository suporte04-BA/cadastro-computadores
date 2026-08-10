Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
Dim appPath, jarPath, logDir

appPath = FSO.GetParentFolderName(WScript.ScriptFullName)
jarPath = appPath & "\backend\target\cadastro-computadores-2.0.0.jar"
logDir = appPath & "\backend\logs"

If Not FSO.FolderExists(logDir) Then
    FSO.CreateFolder(logDir)
End If

If Not FSO.FileExists(jarPath) Then
    MsgBox "JAR nao encontrado: " & jarPath & vbCrLf & vbCrLf & "Execute 'mvn clean package -DskipTests' na pasta backend.", 16, "Erro"
    WScript.Quit(1)
End If

WshShell.CurrentDirectory = appPath & "\backend"
WshShell.Run "javaw -Xms256m -Xmx512m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:TieredStopAtLevel=1 -Dfile.encoding=UTF-8 -jar target\cadastro-computadores-2.0.0.jar", 0, False

WScript.Echo "Servidor iniciado com sucesso!" & vbCrLf & "Acesse: http://localhost:3030"
