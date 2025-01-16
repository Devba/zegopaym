import { exec } from 'child_process';

function beep() {
    exec('aplay /usr/share/sounds/alsa/Front_Center.wav', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
}

beep(); // Beep!

beep(); // Beep twice!