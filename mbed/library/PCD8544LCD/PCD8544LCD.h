/* mbed PCD8544 - Graphic Library for driving monochrome displays based on PCD8544
 *  used in Nokia 3310, 3315, 3330, 3350, 3410, 3210,  5110, 5120, 5130, 5160, 6110, 6150
 *
 * Copyright (c) 2011, Wim De Roeve
 * partial port of the code found on http://serdisplib.sourceforge.net/ser/pcd8544.html#links
 * and by Petras Saduikis <petras@petras.co.uk>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
#ifndef PCD8544LCD_H
#define PCD8544LCD_H

// the Nokia 3310 has a resolution of 84 x 48
//  the Nokia 3410 has a resolution of 102 x 72

#include "mbed.h"

/* Number of pixels on the LCD */
#define LCD_X_RES  84   //84  
#define LCD_Y_RES  48    //48
#define LCD_BANKS (LCD_Y_RES / 8)

#define LCD_CACHE_SIZE ((LCD_X_RES * LCD_Y_RES) / 8)

#define MAX_ADR_X  (LCD_X_RES)-1
#define MAX_ADR_Y  LCD_BANKS-1

#define HIGH  1
#define LOW   0
#define TRUE  1
#define FALSE 0

/* Display control command */
#define EXTENDEDSET   0x21
#define STANDARDSET   0x20
#define DISPLAYOFF    0x08  // switch off display 
#define ALL_SEG_ON    0x09  // switch on display and set to all pixels on
#define NORMAL_MODE   0x0C  // NOREVERSE
#define INVERSE_MODE  0x0D  // REVERSE

#define SET_ADDRES_X  0x80
#define SET_ADDRES_Y  0x40


typedef uint8_t BYTE;

typedef enum {
    PIXEL_OFF = 0,
    PIXEL_ON = 1,
    PIXEL_XOR = 2
}ePixelMode;

typedef enum {
    FILL_OFF = 0,
    FILL_ON = 1
}eFillMode;

typedef enum {
    RASTER_OFF = 0,
    RASTER_ON = 1
}eRasterMode;

typedef enum {
    DRAW_OVERWRITE = 0,
    DRAW_MERGE = 1
}eDrawMode;


typedef enum {
    VERYSMALLFONT = 0, //3x5
    TINYFONT =      1, //5x7
    SMALLFONT =     2, //6x8
    NORMALFONT =    3, //8x8
    BIGFONT    =    4, //8x12&#65533;
    TIMENUMBERFONT= 5, //16x20
    BIGNUMBERFONT=  6
}eFonts;

typedef enum {
    C_POINT          = 0, //point
    C_LINE    =      1, //line
    C_VLINE       =     2, //Vertical Line
    C_HLINE       =    3, //Horizontal Line
}eChartMode;

typedef enum {
    SPACE_NONE = 0,
    SPACE_NORMAL = 1
}eSpaceMode;



enum eDisplayMode {NORMAL, HIGHLIGHT};

class PCD8544LCD {

    /* PCD8544 from Philips Semiconductors is
        48 x 84 pixels monochrome matrix LCD controller/driver

        The PCD8544 has a 504 byte memory with NO read function.
        Each bit is a pixel
        You can only write 1 byte at a time in vertical or horizontal mode.
        There is no read functionality with the controller.
        Caching a copy of the LCD-memory is the only solution if we want
        to set one pixel at a time.

    */
public:
    PCD8544LCD(PinName mosi, PinName miso, PinName sclk,
               PinName cs, PinName dc, PinName reset);

    /** init()
     *
     * Initialise the device.
     * @param PinName SPI mosi
     * @param PinName SPI miso
     * @param PinName SPI sclk
     * @param PinName DigitalOut cs
     * @param PinName DigitalOut dc
     * @param PinName DigitalOut reset
    */

    void init();

    /** cls()
     *  clears the cached copy of the screen
     *  and the screen itself
    */
    void cls(bool fupdate=true);

    /** update()
     *  copies the cached memory to the screen
     *  use this to update the screen after
     *  - drawBitmap
    */
    void update();

    /** close()
     *  screen display OFF
    */
    void close();

    /** locate(x,y)
     *  sets the cursor on position x,y
    */
    void locate         (BYTE x0, BYTE y0);

    void chooseFont(eFonts font);

    void writeString    (BYTE x0, BYTE y0, char* string,  eFonts font,eDisplayMode dmode,eSpaceMode smode, BYTE fupdate);
    void writeChar      (BYTE x0, BYTE y0, BYTE ch,  eFonts font,eDisplayMode mode, BYTE update);

    /** drawBitmap(x,y,bitmap,xsize,ysize)
     *  draw a monochrome bitmap on position x,y
     *  with size xsize,ysize
    */
    void drawBitmap     (BYTE x0, BYTE y0, const unsigned char* bitmap, BYTE bmpXSize, BYTE bmpYSize, BYTE update);

    void drawpixel      (BYTE x0, BYTE y0, ePixelMode pmode, BYTE update);
    void drawline       (BYTE x0, BYTE y0, BYTE x1,BYTE y1, ePixelMode pmode, BYTE update);
    void drawcircle     (BYTE x0, BYTE y0, BYTE radius, ePixelMode pmode, BYTE update);
    void drawrectangle  (BYTE x0, BYTE y0, BYTE x1,BYTE y1, eFillMode fill, ePixelMode pmode, BYTE update);
    void drawprogressbar(BYTE x0, BYTE y0, BYTE w, BYTE h, BYTE percentage, BYTE update);
    void drawchart      (BYTE  x0, BYTE y0, BYTE w, BYTE h, BYTE unitx, BYTE unity,
                         eRasterMode rMode, eChartMode cMode, eDrawMode dMode,int16_t * val,  int size, int t);

private:

    SPI _spi;
    DigitalOut _cs;    // chip select
    DigitalOut _dc;    // data / command
    DigitalOut _reset; // reset

    void writeCmd(BYTE data);
    void writeData(BYTE data);

    BYTE LcdCache[LCD_CACHE_SIZE]; // __attribute__((section("AHBSRAM0")));

    int LcdCacheIdx;
    int _LoMark;
    int _HiMark;
    int Scale;

    BYTE _font_width;
    BYTE _font_height;
    BYTE _font_start;
    BYTE _font_end;
    unsigned char* _pFont;

};

#endif


