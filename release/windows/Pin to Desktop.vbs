' Creates C:\Users\<you>\Desktop\Aetherion Outside.lnk pointing at this folder's launcher.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
desktop = sh.SpecialFolders("Desktop")
Set link = sh.CreateShortcut(desktop & "\Aetherion Outside.lnk")
link.TargetPath = dir & "\Play Aetherion Outside.vbs"
link.WorkingDirectory = dir
link.Description = "Aetherion Outside — Harbour of Dusk"
link.WindowStyle = 1
link.Save
sh.Popup "Desktop shortcut ready:" & vbCrLf & desktop & "\Aetherion Outside.lnk", 5, "Aetherion Outside", 64
