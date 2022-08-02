const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const songName = $('.songName')
const artist = $('.artist')
const cover = $('.cover')
const audio = $('#audio')
const cd = $(".disk")
const playBtn = $('.btn-play')
const progress = $('.progress')
const nextBtn =$('.btn-next')
const prevBtn =$('.btn-prev')
const replayBtn =$('.btn-loop')
const randomBtn = $('.btn-switch')
const randomList = []
const playList = $('.maint_playList')
const ctrlVolume = $('.volumeRange')
const volume = $('.volume')
const volIcon = $('.volIcon')
const muted = $('.muted')
const app = {
       curentIndex:0,
       isPlaying:false,
       isReplay:false,
       isRandom:false,
       isMute:false,
       songs:[
              {
                     name:'Chúng ta không thuộc về nhau',
                     singer:'Sơn Tùng MTP',
                     path:'./songs/Ctktvn.mp3',
                     image:'./img/1470111712632_500.jpg'
              },
              {
                     name:'Blank space',
                     singer:'taylor swift',
                     path:'./songs/blank space.mp3',
                     image:'./img/artworks-000104596134-1wfkwr-t500x500.jpg'
              },
              {
                     name:'Dust till dawn',
                     singer:'Zayn(ft.Sia)',
                     path:'./songs/dust till dawn.mp3',
                     image:'./img/artworks-000330707796-c9xqsh-t500x500.jpg'
              },
              {
                     name:'No lie',
                     singer:'Sean Paul (ft.Dua Lipa)',
                     path:'./songs/no lie.mp3',
                     image:'./img/artworks-000212816587-3pxa7y-t500x500.jpg'
              },
              {
                     name:'Someone Like You',
                     singer:'Adele',
                     path:'./songs/adele_someone_like_you_official_music_video_-2838001052823121463.mp3',
                     image:'./img/artworks-000071639681-fa6xyc-t500x500.jpg'
              }
              ,
              {
                     name:'Lovely',
                     singer:'Billie Eilish, Khalid',
                     path:'./songs/billie_eilish_khalid_lovely_7157870383268602650.mp3',
                     image:'./img/artworks-000414845502-pfu969-t500x500 (1).jpg'
              }
              ,
              {
                     name:`We Don't Talk Anymore `,
                     singer:'Charlie Puth (ft.Selena Gomez) ',
                     path:'./songs/charlie_puth_we_don_t_talk_anymore_feat_selena_gomez_official_video_-7377494420096729296.mp3',
                     image:'./img/image5-12.jpg'
              }
       ],
                        // render  play list 
       render: function(){
              const htmls = this.songs.map((song,index) =>{
                     return ` <div class="song ${index === this.curentIndex ?'active' :''} " data="${index}">
                     <div class="thumb" style="background-image: url('${song.image}')">
                     <i class="fa-solid fa-play"></i>
                     <img src="https://vikdang.github.io/Code_web_music_player/assets/img/SongActiveAnimation/icon-playing.gif"  alt="" class="wave">
                     </div>
                     <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                     </div>
                     <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                     </div>
              </div>`
              })
              playList.innerHTML = htmls.join('\n')
              
              
       },
                     // define Properties
       defineProperties: function(){
              Object.defineProperty(this,'curentSong',{
                     get: function(){
                            return this.songs[this.curentIndex]
                     }
              })
              
       },
       //               // test curentSong
       // curentSong: function(){
       //        return this.songs[this.curentIndex]
       // },
       //               // loading Curent Song
       loadCurrentSong: function(){
              songName.textContent = `${this.curentSong.name}`
              artist.textContent = `${this.curentSong.singer}`
              cover.src = `${this.curentSong.image}`
              audio.src = `${this.curentSong.path}`
              this.render()
              
       },
                    // event zoom out disk play
       handleEvent: function(){
              let valueVol = 1;
              
              const cdWidth = cd.offsetWidth
              // rotate cover image
              const rotateCover = cover.animate([
                     {transform:'rotate(360deg)'}
              ],{
                     duration:10000,//seconds
                     iterations:Infinity
              })
              rotateCover.pause()
              // event scrool playlist
              document.onscroll = function(){
                     const scrollTop = window.scrollY||document.documentElement.scrollTop;
                     const newCdwidth = cdWidth - scrollTop;
                     cd.style.width =newCdwidth > 0 ?newCdwidth + 'px' : 0;
                     cd.style.opacity = newCdwidth/cdWidth;
              }
              // event click play button
              playBtn.addEventListener('click',()=>{
                     if(this.isPlaying){
                            audio.pause()
                     }
                     else{
                            audio.play()
                     }
              })
              // when audio is playing
              audio.addEventListener('play',()=>{
                     playBtn.classList.add('is_playing')      
                     this.isPlaying = true
                     rotateCover.play()
              })
              // when audio is pause
              audio.addEventListener('pause',()=>{
                     playBtn.classList.remove('is_playing')      
                     this.isPlaying = false
                     rotateCover.pause()
              })
              //song progress bar
              
              audio.addEventListener('timeupdate',()=>{
                     if(!isNaN(audio.duration)){
                            const progressPercents = Math.floor((audio.currentTime/audio.duration)*100)
                            progress.value = progressPercents
                     } 
              })
              
              // changing progress
              playBtn.addEventListener('click',()=>{
                     if(this.isPlaying){ // when audio is pause
                            progress.onmousedown = ()=>{
                                   this.changingProgress()
                            }
                            progress.onmouseup = ()=>{
                                   audio.pause()
                            }
                     }
                     else{  // when audio is playing
                            progress.onmousedown = ()=>{
                                   this.changingProgress()
                            }
                            progress.onmouseup = ()=>{
                                   audio.play()
                            }
                     }
              })
              
              // Auto next song
              audio.addEventListener('ended',()=>{
                     if(!this.isReplay){ //false
                            if(!this.isRandom){ // false
                                   if(this.curentIndex >=(this.songs.length - 1)){
                                          this.curentIndex = 0
                                          this.loadCurrentSong()
                                          audio.play()
                                   }
                                   else{ //true
                                          this.curentIndex+=1;
                                          this.loadCurrentSong()
                                          audio.play()
                                   }
                            }
                            else{ // true
                                   this.playRandomSong()
                                   audio.play()
                            }
                            }
                            
                     else{ // true
                            this.loadCurrentSong()
                            audio.play()
                     }
                     
              })
              // handle next songs
              nextBtn.addEventListener('click',()=>{
                     if(!this.isRandom){ // false 
                            if(this.curentIndex >=(this.songs.length - 1)){
                                   this.curentIndex = 0
                                   this.loadCurrentSong()
                                   audio.play()
                            }
                            else{
                                   this.curentIndex+=1;
                                   this.loadCurrentSong()
                                   audio.play() 
                            }
                     }
                     else{ //true
                            this.playRandomSong()
                            audio.play()
                     }
                     
              })
              // handle prev songs
              prevBtn.addEventListener('click',()=>{
                     if(!this.isRandom){
                            if(this.curentIndex <= 0){
                                   this.curentIndex = (this.songs.length -1)
                                   this.loadCurrentSong()
                                   audio.play()
                            }
                            else{
                                   this.curentIndex-=1;
                                   this.loadCurrentSong()
                                   audio.play()
                            }
                     }
                     else{
                            this.playRandomSong()
                            audio.play()
                     }
                     
                     
              })
              // handle play songs
              playList.addEventListener("click", (e)=>{
                     const songNode = e.target.closest('.song:not(.active)')
                     if(songNode){
                            if(!e.target.closest('.option')){
                                   this.curentIndex = Number(songNode.getAttribute('data') )
                                   this.loadCurrentSong()
                                   audio.play()
                            }
                            
                     }
              })
              // replay Song
              replayBtn.addEventListener("click",()=>{
                     if(this.isReplay){
                            this.isReplay = false
                            replayBtn.classList.remove('replays')
                            audio.loop = false
                     }
                     else{
                            replayBtn.classList.add('replays')
                            this.isReplay = true
                            this.curentIndex = this.curentIndex
                            audio.loop = true
                            audio.play()
                     }
              })
              // random Song
              randomBtn.addEventListener('click',()=>{
                     if(this.isRandom){
                            this.isRandom = false
                            randomBtn.classList.remove('isRandom')
                     }
                     else{
                            randomBtn.classList.add('isRandom')
                            this.isRandom = true
                     }
              })
              //volume control
              
              ctrlVolume.addEventListener('input', ()=>{
                            valueVol = ctrlVolume.value
                            audio.volume = valueVol
                            if(audio.volume === 0){
                                   muted.classList.replace('fa-volume-high','fa-volume-xmark')
                                   this.isMute = true
                                   valueVol = 1
                            }
                            else{
                                   muted.classList.replace('fa-volume-xmark','fa-volume-high')
                                   this.isMute = false
                            }
                     
                     
              })
              volIcon.addEventListener('click', ()=>{
                     if(!this.isMute){ //true
                            muted.classList.replace('fa-volume-high','fa-volume-xmark')
                            this.isMute = true
                            audio.volume = 0
                            ctrlVolume.value = 0
                     }
                     else{ //false
                            muted.classList.replace('fa-volume-xmark','fa-volume-high')
                            this.isMute = false
                            audio.volume = valueVol
                            ctrlVolume.value = valueVol 
                            
                     }
              })
              
       },
       // changing progress
       changingProgress: function(){
              progress.addEventListener('input',()=>{
                     const progressSeeked = (audio.duration*progress.value)/100
                     audio.currentTime = progressSeeked 
                     audio.pause()
                     
              })
       },
       playRandomSong: function(){ 
              let newIndex 
                     do{
                            newIndex = Math.floor(Math.random()*this.songs.length)       
                     }while(newIndex === this.curentIndex)
                     this.curentIndex = newIndex
                     this.loadCurrentSong()
       },
       start: function(){
              // handle event
              this.handleEvent()
              //define property
              // this.curentSong()
              this.defineProperties()
              this.loadCurrentSong()
              this.render()
              
       }
       
} 
app.start();