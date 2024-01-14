# azerty-midi-controller

## Install

### Ableton Live
Copy external/live11/amc folder to :   
Mac: HD:/Users/[Username]/Library/Preferences/Ableton/Live x.x.x/User Remote Scripts   
Windows: C:\Users\[Username]\AppData\Roaming\Ableton\Live x.x.x\Preferences\User Remote Scripts   


## Install

```cmd
npm i
```

## Start
```cmd
npm start -- -c src/config/ableton-live.yaml
```

With debug trace on MacOS
```cmd
NODE_ENV=dev npm start -- -c src/config/ableton-live.yaml
```
