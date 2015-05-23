#include "mbed.h"
#include "Hall.h"
#include "screen.h"

DigitalOut myled(LED1);

Serial pc(USBTX,USBRX);



//InterruptIn speedHall(PC_13);
InterruptIn speedHall(A1);
//AnalogIn in(A1);

Screen screen;
Hall hall;
int a=32;
int counter=0;
void fall(){
	counter++;
}

int main() {
	pc.baud(9600);
	hall.init();
	screen.init();
	screen.changeScene(TEST);
	
	speedHall.fall(&fall);
	speedHall.mode(PullUp);
	
    while(1) {
			
			wait(0.01);
			pc.printf("%d",counter);
				//screen.changeScene(SPEED);
				//screen.changeScene(MESSAGE_ALERT);
		//	p.writeString(i++,i,"ABCD",SMALLFONT,NORMAL,SPACE_NONE,true);
    };
		
}
