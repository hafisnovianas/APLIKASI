document.addEventListener('DOMContentLoaded', function () {
    const detectButton = document.getElementById('detectButton')
    const fullScreenButton = document.getElementById('fullScreenButton')
    const indikators = document.getElementsByClassName('indikator');
    
    detectButton.addEventListener('click',(event) => {
        onDetection();
    })

    fullScreenButton.addEventListener('click', (event) => {
        toggleFullScreen();
    })

    async function onDetection() {
        const detection = await detect()
        console.log(detection)

        let title = 'Minyak ' + detection
        let icon = 'success'

        if (detection == 'Oplosan') icon = 'warning'

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
                timer: 2000
            });
            Array.from(indikators).forEach((indikator) => {
                indikator.style.backgroundColor = 'transparent'
                if (indikator.id == detection) {
                    indikator.style.backgroundColor = '#E9EFEC'
                }
            })
        }, 2000);  // Simulasi delay 2 detik untuk menyimpan
    }

    async function detect() {
        try {
            const response =  await fetch('/detect')
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            return data.detection
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