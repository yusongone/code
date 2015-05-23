#include "BigNum.h"

BigNum::BigNum(){}

void BigNum::drawPoint(char x,char y,PCD8544LCD* p,char index){
	p->drawBitmap(x,y,point[0],18,8,true);
}
void BigNum::drawNum(char x,char y,PCD8544LCD* p,char index){
		p->drawBitmap(x,y,top[Num[index][0]],18,8,false);
		p->drawBitmap(x,y+1,buttom[Num[index][1]],18,8,false);
		p->drawBitmap(x,y+2,top[Num[index][2]],18,8,false);
		p->drawBitmap(x,y+3,buttom[Num[index][3]],18,8,false);
}

void BigNum::spliceNum(PCD8544LCD p,int i){
	PCD8544LCD* f=&p;
	//Point(f);
	drawNum(1,2,f,9);
	drawNum(5,2,f,7);
	drawNum(10,2,f,8);
}

void BigNum::showMessage(PCD8544LCD* p){
		int x=0,y=0;
		p->drawBitmap(x,y,message_icon[0],84,8,false);
	p->drawBitmap(x,y+1,message_icon[1],84,8,false);
	p->drawBitmap(x,y+2,message_icon[2],84,8,false);
	p->drawBitmap(x,y+3,message_icon[3],84,8,false);
	p->drawBitmap(x,y+4,message_icon[4],84,8,false);
	p->drawBitmap(x,y+5,message_icon[5],84,8,false);
}
void BigNum::showPhone(PCD8544LCD* p){
		int x=0,y=0;
		p->drawBitmap(x,y,phone_icon[0],84,8,false);
	p->drawBitmap(x,y+1,phone_icon[1],84,8,false);
	p->drawBitmap(x,y+2,phone_icon[2],84,8,false);
	p->drawBitmap(x,y+3,phone_icon[3],84,8,false);
	p->drawBitmap(x,y+4,phone_icon[4],84,8,false);
	p->drawBitmap(x,y+5,phone_icon[5],84,8,false);
}



