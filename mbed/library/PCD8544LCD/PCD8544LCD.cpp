/* mbed PCD8544 - Graphic Library for driving monochrome displays based on
 *  the PCD8544  48 x 84 pixels matrix LCD controller/driver
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
 * copies of the updaSoftware, and to permit persons to whom the Software is
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

#include "PCD8544LCD.h"

#include "fonts/font_3x5.h"
#include "fonts/font_5x7.h"
#include "fonts/font_6x8.h"
#include "fonts/font_8x8.h"
#include "fonts/font_8x12.h"
#include "fonts/font_16x20.h"
#include "fonts/font_16x24.h"

//#include "DebugTrace.h"
#include "sstream"
#include "stdio.h"
#include "stringman.h"

//DebugTrace pc_PCD8544(ON, TO_SERIAL);

/*
       PCD8544 from Philips Semiconductors is
       48 x 84 pixels monochrome matrix LCD controller/driver

       generic for LPH7366, LPH7677, and LPH7779; no backlight

       model name (of display)     type     used in cellphones
       LPH 7366         2     Nokia 5110, 5120, 5130, 5160, 6110, 6150
       LPH 7677         1     Nokia 3210
       LPH 7779         1     Nokia 3310, 3315, 3330, 3350, 3410


       +-------------------------+
       |     1 2 3 4 5 6 7 8     |
       |     # # # # # # # #     |
       |  ===#=#=#=#=#=#=#=#===  |  Red     1 .. VDD  - chip power supply +3.3V
       +--=====================--+  Green   2 .. SCLK - serial clock line of LCD
       |                         |  Yellow  3 .. SI   - serial data input of LCD
       |                         |  Gray    4 .. D/C  - command/data switch
       |        rear view        |  Blue    5 .. /CS  - active low chip select
       |  connector is visible   |  Black   6 .. GND  - for VDD
       |                         |          7 .. Vout - output of display-internal dc/dc converter
       |         LPH7779         |  White   8 .. /RES - active low reset
       |                         |
       +-------------------------+

*/


PCD8544LCD::PCD8544LCD (PinName mosi, PinName miso, PinName sck,
                        PinName cs, PinName data_cmd, PinName reset):
        _spi(mosi, miso, sck),
        _cs(cs),
        _dc(data_cmd),
        _reset(reset) {

    _cs    = HIGH;
    _reset = HIGH;

    init();
}

void PCD8544LCD::init() {

   // pc_PCD8544.traceOut("Init PCD8544\r\n");
    _spi.format(8,0);
    _spi.frequency(1000000);

    /* reset lcd

       After reset, the LCD driver has the following state:
       - Power-down mode (bit PD = 1)
       - Horizontal addressing (bit V = 0)
       - normal instruction set (bit H = 0)
       - Display blank (bit E = D = 0)
       - Address counter X6 to X0 = 0; Y2 to Y0 = 0
       - Temperature control mode (TC1 TC0 = 0)
       - Bias system (BS2 to BS0 = 0)
       - VLCD is equal to 0, the HV generator is switched off
        (VOP6 to VOP0 = 0)
       - After power-on, the RAM contents are undefined.
    */

    wait_ms(1);
    _reset = LOW;  // reset
    wait_ms(1);
    _reset = HIGH;

    writeCmd(EXTENDEDSET);   // folowing commands are extended ones
    writeCmd(0xc8);          // Set Voltage 0x80+value: set contrast
    writeCmd(0x06);          // set temp coefficient
    writeCmd(0x13);          // set BIAS mode 1:48
    writeCmd(STANDARDSET);   // STANDARDSET: following commands are standard ones

    writeCmd(NORMAL_MODE);


    _LoMark = 0;
    _HiMark = LCD_CACHE_SIZE - 1;
    //_LoMark = LCD_CACHE_SIZE; // Reset watermark pointers.
    // _HiMark = 0;

    cls();
}

void PCD8544LCD::writeCmd(BYTE data) {
    _cs = LOW;
    _dc = LOW;
    _spi.write(data);
    _cs = HIGH;
}

void PCD8544LCD::writeData(BYTE data) {
    _cs = LOW;
    _dc = HIGH;
    _spi.write(data);
    _cs = HIGH;
}

void PCD8544LCD::close() {
    writeCmd(DISPLAYOFF);
    _cs    = HIGH;
    _reset = HIGH;
}

//  GRAPHICAL functions

void PCD8544LCD::cls(bool fupdate) {
    for (int i = 0; i < LCD_CACHE_SIZE ; i++) {
        LcdCache[i]=0x00;
    }
    _LoMark = 0;
    _HiMark = LCD_CACHE_SIZE - 1;
    if (fupdate)
        update();
}

void PCD8544LCD::update() {

    if ( _LoMark < 0 )
        _LoMark = 0;
    else if ( _LoMark >= LCD_CACHE_SIZE )
        _LoMark = LCD_CACHE_SIZE - 1;
    if ( _HiMark < 0 )
        _HiMark = 0;
    else if ( _HiMark >= LCD_CACHE_SIZE )
        _HiMark = LCD_CACHE_SIZE - 1;

    writeCmd(SET_ADDRES_X | (_LoMark % LCD_X_RES));
    writeCmd(SET_ADDRES_Y | (_LoMark / LCD_X_RES));

    for (int i = _LoMark; i <= _HiMark; i++ ) {
        writeData( LcdCache[i]);
    }
    _LoMark = LCD_CACHE_SIZE - 1;
    _HiMark = 0;
}



void PCD8544LCD::locate(BYTE x0, BYTE y0) {
    LcdCacheIdx = x0*LCD_BANKS + y0 * LCD_X_RES;
}

// Bitmap

void PCD8544LCD::drawBitmap(BYTE x0, BYTE y0, const unsigned char* bitmap, BYTE bmpXSize, BYTE bmpYSize,BYTE fupdate) {
    BYTE row;

    if (0 == bmpYSize % 8)
        row = bmpYSize/8;
    else
        row = bmpYSize/8 + 1;

    _LoMark= 0;
    _HiMark= LCD_CACHE_SIZE - 1;

    for (BYTE n = 0; n < row; n++) {
        locate(x0, y0);

        for (BYTE i = 0; i < bmpXSize; i++) {
            LcdCache[LcdCacheIdx+ i]=bitmap[i + (n * bmpXSize)];
        }
        y0++;
    }
    if (fupdate==TRUE)
        update();
}

void PCD8544LCD::writeString(BYTE x0, BYTE y0, char* string,  eFonts font,eDisplayMode dmode,eSpaceMode smode, BYTE fupdate) {
    locate(x0, y0);
    chooseFont(font);

    while (*string) {
        writeChar(x0,y0,*string++,font, dmode, FALSE);
        x0+=_font_width;   // width +1;
        if (smode==SPACE_NORMAL)
            x0++;
    }
    if (fupdate==TRUE)
        update();
}

void PCD8544LCD::chooseFont(eFonts font) {

    switch (font) {

        case VERYSMALLFONT: {
            _font_width  = FONT3x5_WIDTH;
            _font_height = FONT3x5_HEIGHT;
            _font_start  = FONT3x5_START;
            _font_end    = FONT3x5_END;

            _pFont = (unsigned char*) font_3x5;

            break;
        }
        case TINYFONT: {
            _font_width  = FONT5x7_WIDTH;
            _font_height = FONT5x7_HEIGHT;
            _font_start  = FONT5x7_START;
            _font_end    = FONT5x7_END;

            _pFont = (unsigned char*) font_5x7;

            break;
        }

        case SMALLFONT: {
            _font_width  = FONT6x8_WIDTH;
            _font_height = FONT6x8_HEIGHT;
            _font_start  = FONT6x8_START;
            _font_end    = FONT6x8_END;

            _pFont = (unsigned char*) font_6x8;

            break;
        }
        case NORMALFONT: {
            _font_width  = FONT8x8_WIDTH;
            _font_height = FONT8x8_HEIGHT;
            _font_start  = FONT8x8_START;
            _font_end    = FONT8x8_END;

            _pFont = (unsigned char*) font_8x8;

            break;
        }
        case BIGFONT: {
            _font_width  = FONT8x12_WIDTH;
            _font_height = FONT8x12_HEIGHT;
            _font_start  = FONT8x12_START;
            _font_end    = FONT8x12_END;

            _pFont = (unsigned char*) font_8x12;

            break;
        }

        case TIMENUMBERFONT: {
            _font_width  = FONT16x20_WIDTH;
            _font_height = FONT16x20_HEIGHT;
            _font_start  = FONT16x20_START;
            _font_end    = FONT16x20_END;

            _pFont = (unsigned char*) font_16x20;

            break;
        }

        case BIGNUMBERFONT: {
            _font_width  = FONT16x24_WIDTH;
            _font_height = FONT16x24_HEIGHT;
            _font_start  = FONT16x24_START;
            _font_end    = FONT16x24_END;

            _pFont = (unsigned char*) font_16x24;

            break;
        }
    }
}

void PCD8544LCD::writeChar(BYTE x0, BYTE y0, BYTE ch,  eFonts font, eDisplayMode mode,BYTE fupdate) {
    BYTE sendByte;

    chooseFont(font);

    if ((ch <= _font_start) || (ch > _font_end))
        ch=_font_start;

    ch -= _font_start;

    for (int i = 0; i < _font_width; i++ ) {

        sendByte = *(_pFont + ch*_font_width +i);
        sendByte = ((mode == NORMAL)? sendByte:(sendByte ^ 0xff));

        for (int j=0 ; j<_font_height; j++) {
            if ((sendByte & 0x01) == 0x01) {
                drawpixel(x0,y0+j,PIXEL_ON,FALSE);
            } else {
                drawpixel(x0,y0+j,PIXEL_OFF,FALSE);
            }
            sendByte=sendByte>>1;
        }
        x0++;
    }
    if (fupdate==TRUE)
        update();
}


void PCD8544LCD::drawpixel(BYTE x0, BYTE  y0, ePixelMode mode,BYTE fupdate) {
    uint16_t index;
    BYTE offset;
    BYTE data;

    if ( x0 > LCD_X_RES-1 ) return;
    if ( y0 > LCD_Y_RES-1 ) return;

    index = ((y0 / 8) * LCD_X_RES) + x0;
    offset = y0 - ((y0 / 8) * 8);

    data = LcdCache[index];

    if ( mode == PIXEL_OFF ) {
        data &= (~(0x01 << offset));
    } else if ( mode == PIXEL_ON ) {
        data |= (0x01 << offset);
    } else if ( mode == PIXEL_XOR ) {
        data ^= (0x01 << offset);
    }
    LcdCache[index] = data;

    if ( index < _LoMark ) {
        _LoMark = index;
    }
    if ( index > _HiMark ) {
        _HiMark = index;
    }
    if (fupdate==TRUE)
        update();
}

void PCD8544LCD::drawline(BYTE  x0, BYTE y0, BYTE x1, BYTE y1, ePixelMode mode,BYTE fupdate) {
    int dx, dy, stepx, stepy, fraction;

    dy = y1 - y0;
    dx = x1 - x0;
    if ( dy < 0 ) {
        dy = -dy;
        stepy = -1;
    } else {
        stepy = 1;
    }
    if ( dx < 0 ) {
        dx = -dx;
        stepx = -1;
    } else {
        stepx = 1;
    }
    dx <<= 1;
    dy <<= 1;

    drawpixel( x0, y0, mode , FALSE);
    if ( dx > dy ) {
        fraction = dy - (dx >> 1);
        while ( x0 != x1 ) {
            if ( fraction >= 0 ) {
                y0 += stepy;
                fraction -= dx;
            }
            x0 += stepx;
            fraction += dy;
            drawpixel( x0, y0, mode , FALSE);
        }
    } else {
        fraction = dx - (dy >> 1);
        while ( y0 != y1 ) {
            if ( fraction >= 0 ) {
                x0 += stepx;
                fraction -= dy;
            }
            y0 += stepy;
            fraction += dx;
            drawpixel( x0, y0, mode , FALSE);
        }
    }
    if (fupdate==TRUE)
        update();
}

void PCD8544LCD::drawrectangle(BYTE  x0, BYTE y0, BYTE x1, BYTE y1, eFillMode fill, ePixelMode mode,BYTE fupdate) {
    if (fill==1) {
        BYTE i, xmin, xmax, ymin, ymax;
        if (x0 < x1) { // Find x min and max
            xmin = x0;
            xmax = x1;
        } else {
            xmin = x1;
            xmax = x0;
        }
        if (y0 < y1) { // Find the y min and max
            ymin = y0;
            ymax = y1;
        } else {
            ymin = y1;
            ymax = y0;
        }
        for (; xmin <= xmax; ++xmin) {
            for (i=ymin; i<=ymax; ++i) {
                drawpixel(xmin, i, mode, FALSE);
            }
        }
    } else {
        drawline(x0, y0, x1, y0, mode, FALSE); // Draw the 4 sides
        drawline(x0, y1, x1, y1, mode, FALSE);
        drawline(x0, y0, x0, y1, mode, FALSE);
        drawline(x1, y0, x1, y1, mode, FALSE);
    }
    if (fupdate==TRUE)
        update();
}

void PCD8544LCD::drawprogressbar(BYTE  x0, BYTE y0, BYTE w, BYTE h, BYTE percentage,BYTE fupdate) {
    drawrectangle(x0,y0,x0+w,y0+h,FILL_OFF,PIXEL_ON, FALSE);
    drawrectangle(x0+2,y0+2,x0+w-2,y0+h-2,FILL_ON,PIXEL_OFF, FALSE);
    drawrectangle(x0+2,y0+2,x0+2+(percentage*(w-4)/100),y0+h-2,FILL_ON,PIXEL_ON, FALSE);
    if (fupdate==TRUE)
        update();
}

void PCD8544LCD::drawchart(BYTE  x0, BYTE y0, BYTE w, BYTE h, BYTE unitx, BYTE unity,
                           eRasterMode rMode, eChartMode cMode,eDrawMode dMode, int16_t * val, int size, int t)  {
    int maxy;
    int _scale=1;
    int prescale=1;

    signed char v1,v2;
    char buffer[4];

    if (size>w)
        size=w;

    // search maximum value to calculate scale
    if (dMode==DRAW_OVERWRITE) {
        maxy=0;
        for (int i=0; i<size;i++) {
            if (val[i]>maxy)
                maxy=val[i];

        }

        if (maxy>h) {  //scale can be 1,2,5  *10i
            prescale= ((maxy-1)/((h/unity)*unity));
            _scale=1;
            while (prescale>10) {
                _scale=_scale*10;
                prescale=prescale/10;
            }
            if (prescale>1)
                _scale=_scale*5;
            else
                if (prescale==1)
                    _scale  =_scale*2;


        }
        Scale=_scale;
    }

    if (dMode==DRAW_OVERWRITE) {
        drawrectangle(x0-11,y0-h,x0+w,y0+4+7,FILL_ON,PIXEL_OFF,FALSE);
        drawline(x0,y0,x0,y0-h,PIXEL_ON,FALSE);
        drawline(x0,y0,x0+w,y0,PIXEL_ON,FALSE);

        //drawrectangle(x0,y0-h,x0+w,y0,FILL_OFF,PIXEL_ON,FALSE);

        for (int i=0;i<=h;i++) {
            if ((i % unity) == 0) {
                drawpixel(x0-2,y0-i,PIXEL_ON,FALSE);
                //    drawpixel(x0+w+2,y0-i,PIXEL_ON,FALSE);

                if (rMode==RASTER_ON) {
                    for (int r=0;r<=w;r++) {
                        if ((r % 2) ==0)
                            drawpixel(x0+r,y0-i,PIXEL_ON,FALSE);
                    }
                }
                // draw vertical axis labels

              itostr(buffer,i*Scale);

                //  pc_PCD8544.traceOut(" %i %s |",i*Scale,buffer);
                writeString(x0-11,y0-i+1,buffer,VERYSMALLFONT,NORMAL,SPACE_NONE,FALSE);

            }
            if ((i % 2) == 0) {
                drawpixel(x0-1,y0-i,PIXEL_ON,FALSE);
                //      drawpixel(x0+w+1,y0-i,PIXEL_ON,FALSE);
            }
        }

        for (int i=0;i<=w;i++) {
            if (((i+(t % unitx)) % unitx) == 0) {
                drawpixel(x0+i,y0+2,PIXEL_ON,FALSE);

                if (rMode==RASTER_ON) {
                    for (int r=0;r<=h;r++) {
                        if ((r % 2) ==0)
                            drawpixel(x0+i,y0-r,PIXEL_ON,FALSE);
                    }
                }
                if (((t-w+i)/unitx)>=0)
                    snprintf(buffer,3,"%i",((t-w+i)/unitx));
                else
                    snprintf(buffer,3,"%i",24+((t-w+i)/unitx));

                // pc_PCD8544.traceOut(" %i %s ",(t-w+i)/unitx,buffer);
                writeString(x0+i-3,y0+4,buffer,VERYSMALLFONT,NORMAL,SPACE_NORMAL,FALSE);
            }
            if ((i % 2) == 0) {
                drawpixel(x0+i,y0+1,PIXEL_ON,FALSE);
            }
        }
   //     update();
    }

     for (int i=0;i<size;i++) {
     //   pc_PCD8544.traceOut(" %i ",val[i]);
        v1 = val[i] / Scale;
        if (v1>h)
            v1=h;

        if (i!=(size-1)) {
            v2 = val[i+1] / Scale;
            if (v2>h)
                v2=h;
        } else
            v2=v1;


        switch (cMode) {
            case C_POINT: {
                drawpixel(x0+i,y0-v1,PIXEL_ON,FALSE);
                break;
            }
            case C_LINE: {
                drawline(x0+i,y0-v1,x0+i+1,y0-v2,PIXEL_ON,FALSE);
                break;
            }
            case C_VLINE: {
                drawline(x0+i,y0-v1,x0+i,y0,PIXEL_ON,FALSE);
                break;
            }
        }
    }

    update();
}

/*
void PCD8544LCD::writeCharBig(BYTE x, BYTE y, BYTE ch, eDisplayMode mode) {
    BYTE sendByte;

    unsigned char* pFont = (unsigned char *) font_bignumber;

    if ('.' == ch)
        ch = 10;
    else if ('+' == ch)
        ch = 11;
    else if ('-' == ch)
        ch = 12;
    else
        ch = ch & 0x0f;

    for (BYTE i = 0; i < 3; i++) {
        locate(x, y + i);

        for (BYTE j = 0; j < 16; j++) {
            sendByte =  *(pFont + ch*48 + i*16 + j);
            writeData((mode == NORMAL)? sendByte : (sendByte^0xff));
        }
    }
}


void PCD8544LCD::writeStringBig(BYTE x0, BYTE y0, char* string, eDisplayMode mode, BYTE fupdate) {
    while (*string) {
        writeCharBig(x0, y0, *string , mode);

        if ('.' == *string++)
            x0 += 5;
        else
            x0 += 12;
    }
}
*/
