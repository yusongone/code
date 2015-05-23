#include "screen.h"

#include "PCD8544LCD.h"

//PCD8544LCD(PinName mosi, PinName miso, PinName sclk,PinName cs, PinName dc, PinName reset);
PCD8544LCD p(D11,NC,D13,D8,D10,D9);
BigNum dnn;

void Screen::init(){
	p.init();
};

void Screen::log(char* dd){
			p.writeString(27,4,dd,SMALLFONT,NORMAL,SPACE_NONE,true);
};

void Screen::changeScene(ScreenType st){
			p.cls();
			if(st==SPEED){
				drawSpeedScene(123);
			}else if(st==MESSAGE_ALERT){
				drawMessageAlertScene();
			}else if(st==TEST){
				
			}
};

void Screen::drawSpeedScene(int speed){
			char dd[6]="SPEED";
			p.writeString(27,4,dd,SMALLFONT,NORMAL,SPACE_NONE,false);
			char a=speed%100%10;
			char b=speed/10%10;
			char c=speed/100;
			dnn.drawNum(1,2,&p,c);
			dnn.drawNum(5,2,&p,b);
			dnn.drawPoint(8,5,&p,0);
			dnn.drawNum(10,2,&p,a);
			p.update();
};

void Screen::drawMessageAlertScene(){
			dnn.showMessage(&p);
			p.update();
}
void Screen::drawPhoneAlertScene(){
			dnn.showPhone(&p);
			p.update();
}
