#include "mbed.h"
#include "NOKIA_5110.h"
#include "PCD8544LCD.h"

DigitalOut myled(LED1);
 //PCD8544LCD(PinName mosi, PinName miso, PinName sclk,PinName cs, PinName dc, PinName reset);
int main() {
		 //LcdPins myPins;
		
		
		PCD8544LCD p(D11,NC,D13,D8,D10,D9);

		p.init();
		//ePixelMode e=PIXEL_OFF;
	//	p.drawpixel(40,5,PIXEL_XOR,true);
		//p.chooseFont(VERYSMALLFONT);
		
		//p.drawcircle(2,2,5,PIXEL_ON,true);
	//p.drawline(82,0,82,18,PIXEL_ON,true);
	//p.drawline(0,0,0,18,PIXEL_ON,true);
		//p.drawline(8,8,16,16,PIXEL_ON,true);
	int i=0;
	bool f=false;
	unsigned char left_a[]={0xfe|0x00,0xfc|0x01,0xf8|0x03,0xf2|0x07};
	unsigned char left_b[]={0xff,0x7f,0x3f,0x1f};
	unsigned char top[]={0x00,0x01,0x03,0x07,0x0f,0x0f,0x0f,0x0f};
	p.drawBitmap(0,0,top,8,4,true);
	p.drawBitmap(1,1,left_a,4,3,true);
	p.drawBitmap(1,2,left_b,4,3,true);
	p.drawBitmap(1,3,left_a,4,3,true);
	p.drawBitmap(1,4,left_b,4,3,true);
	
	wait(5);
    while(1) {
        myled = 1; // LED is ON
        wait(0.2); // 200 ms
        myled = 0; // LED is OFF
        wait(1.0); // 1 sec
			if(i==20)
				f=true;
		//	p.writeString(i++,i,"ABCD",SMALLFONT,NORMAL,SPACE_NONE,true);
    }
		
}
