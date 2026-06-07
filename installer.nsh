!macro customHeader
  !system "echo Building JoyIT Staffing Suite installer..."
!macroend

!macro customInstall
  WriteRegStr HKCU "Software\Joy IT Solutions\JoyIT Staffing Suite" "InstallPath" "$INSTDIR"
  WriteRegStr HKCU "Software\Joy IT Solutions\JoyIT Staffing Suite" "Version" "2.0.0"
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Joy IT Solutions\JoyIT Staffing Suite"
!macroend
