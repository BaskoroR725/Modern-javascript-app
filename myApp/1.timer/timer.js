class Timer {
  constructor(durationInput, startButton, pauseButton, callbacks) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.pauseButton = pauseButton;
    

    //reference to timer callback at line 49
    if (callbacks){
      this.onStart = callbacks.onStart;
      this.onTick = callbacks.onTick;
      this.onComplete = callbacks.onComplete;
    }

    this.startButton.addEventListener('click', this.start);
    this.pauseButton.addEventListener('click', this.pause);
  }

  start = () => {
    if (this.onStart){
      this.onStart(this.timeRemaining);
    }
    if (this.interval) this.pause();
    this.tick();
    this.interval = setInterval(this.tick, 20);//miliseconds
  }

  pause = () =>{
    clearInterval(this.interval)
  }

  tick = () =>{
    if(this.timeRemaining <= 0){
      this.pause();
      if(this.onComplete){
        this.onComplete();
      }
    } else {
      this.timeRemaining = this.timeRemaining - .02;//miliseconds
      if(this.onTick){
        this.onTick(this.timeRemaining);
      }
    }
  }

  get timeRemaining(){
    return parseFloat(this.durationInput.value);
  } 

  set timeRemaining(time){
    this.durationInput.value = time.toFixed(2);
  }

}