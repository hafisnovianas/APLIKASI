document.addEventListener('DOMContentLoaded', function () {
    const detectButton = document.getElementById('detectButton');
    const fullScreenButton = document.getElementById('fullScreenButton');
    const exitButton = document.getElementById('exitButton');
    const indicators = document.getElementsByClassName('indikator');
    
    detectButton.addEventListener('click',() => {
        onDetection();
    })

    fullScreenButton.addEventListener('click', () => {
        toggleFullScreen();
    })

    exitButton.addEventListener('click', () => {
        onKillBrowser();
    })

    async function onDetection() {
        const {prediction, percentage} = await detect()
        console.log(`${prediction} ${percentage}`)
        
        let title = `${percentage}% Minyak ${prediction}`
        let icon = 'success'

        if (prediction == 'Oplosan') icon = 'warning'

        Swal.fire({
            title: 'Detecting...',
            background: '#E9EFEC',
            color: '#16423C',
            allowOutsideClick: false,  // Mencegah keluar dari dialog
            didOpen: () => {
                Swal.showLoading();  // Menampilkan animasi loading
            }
        });

        // Simulasi proses menyimpan data
        setTimeout(() => {
            Swal.fire({
                title: title,
                icon: icon,
                background: '#E9EFEC',
                color: '#16423C',
                showConfirmButton: false,
                timer: 5000
            });
            Array.from(indicators).forEach((indicator) => {
                let bgColor = 'transparent'
                if (indicator.id === prediction) {
                  switch (prediction) {
                    case 'Curah':
                      bgColor = 'yellow';
                      break
                    case 'Kemasan':
                      bgColor = 'green';
                      break
                    case 'Oplosan':
                      bgColor = 'red';
                      break
                  }
                }
                indicator.style.backgroundColor = bgColor;
            })
        }, 1000);  // Simulasi delay 2 detik untuk menyimpan
    }

    async function detect() {
        try {
            const response =  await fetch('/detect')
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            return data
        } catch (error) {
            console.error('Fetch error', error)
            return null
        }
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          }
      }
    }

    async function onKillBrowser() {
        try {
            const response = await fetch('/kill_browser', { method: 'POST' })
            const responseJson = await response.json();
            alert(responseJson.message)
        } catch (error) {
            alert('tidak terhubung ke server', error)
            return null
        }
    }
})