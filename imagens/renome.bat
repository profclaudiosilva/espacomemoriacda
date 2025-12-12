setlocal enabledelayedexpansion
set i=1
for %%a in (*.jpg) do (
  ren "%%a" "foto!i!.jpg"
  set /a i+=1
)
