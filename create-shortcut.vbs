Set WshShell = CreateObject("WScript.Shell")
Set Link = WshShell.CreateShortcut(WshShell.SpecialFolders("Startup") & "\RAWR-MCP.lnk")
Link.TargetPath = "D:\Appz\-RAWR-\start-rawr.bat"
Link.WorkingDirectory = "D:\Appz\-RAWR-\backend"
Link.WindowStyle = 7
Link.Description = "RAWR Memory Bridge Auto-Start"
Link.Save
WScript.Echo "Shortcut creado en Startup"
