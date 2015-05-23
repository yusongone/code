#ifndef SCREEN_H
#define SCREEN_H

#include "PCD8544LCD.h"
#include "BigNum.h"

typedef enum{
	SPEED=0,
	MESSAGE_ALERT=1,
	TEST=2
}ScreenType;


class Screen{
	public:
		void init();
		void changeScene(ScreenType st);
		void log(char* c);
	private:
		void drawSpeedScene(int speed);
		void drawMessageAlertScene();
		void drawPhoneAlertScene();
};

#endif
