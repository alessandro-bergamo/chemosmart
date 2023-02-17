document.addEventListener("DOMContentLoaded", function(event) {
   
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('click', ()=>{
    // show navbar
    nav.classList.toggle('show-sd')
    // change icon
    toggle.classList.toggle('bx-x')
    // add padding to body
    bodypd.classList.toggle('body-pd')
    // add padding to header
    headerpd.classList.toggle('body-pd')
    })
    }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    //funzione che permette di nascondere testo del opz del menu quando sidebar chiusa/schermo piccolo
    $(document).ready(function() {
        let open = true
        $('#header-toggle').click(function (){
                if(open){
                    $('.nav_name').hide()
                    $('.nav_sub_icon').show()
                    open = false
                    
                } else if(!open) {
                    $('.nav_name').show()
                    $('.nav_sub_icon').hide()
                    open = true
                    
                }
        });
        
        // funzione che permette la modifica del comportamento della sidebar quando viene fatto resize della pagina
        $(window).resize(function () {
            if($(window).width() <= 768){
                $('.nav_sub_icon').show()
                $('.nav_name').hide()
                
            } else {
                if(!open){
                    
                    $('.nav_name').hide()
                    $('.nav_sub_icon').show()
                    console.log('open is now ' + open)
                } else if(open) {
                    
                    $('.nav_name').show()
                    $('.nav_sub_icon').hide()
                    
                }
            }
        });
    });

    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink(){
    if(linkColor){
    linkColor.forEach(l=> l.classList.remove('active'))
    this.classList.add('active')
    }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    
     // Your code to run since DOM is loaded and ready
    });