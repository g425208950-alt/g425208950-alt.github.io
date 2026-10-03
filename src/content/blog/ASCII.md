---
title: ASCII相关知识点
description: 在写博客之前脑子里其实没有ASCII的详尽知识，知道这是个简易的字符表，却因为懒惰没有真的去了解清楚
pubDate: 2026/10/03

---

## ASCII表

### 控制字符

| 十进制 | 十六进制 | 缩写  | 名称                      |
| --- | ---- | --- | ----------------------- |
| 0   | 00   | NUL | Null                    |
| 1   | 01   | SOH | Start of Heading        |
| 2   | 02   | STX | Start of Text           |
| 3   | 03   | ETX | End of Text             |
| 4   | 04   | EOT | End of Transmission     |
| 5   | 05   | ENQ | Enquiry                 |
| 6   | 06   | ACK | Acknowledge             |
| 7   | 07   | BEL | Bell（响铃 `\a`）           |
| 8   | 08   | BS  | Backspace（`\b`）         |
| 9   | 09   | HT  | Horizontal Tab（`\t`）    |
| 10  | 0A   | LF  | Line Feed（`\n`）         |
| 11  | 0B   | VT  | Vertical Tab            |
| 12  | 0C   | FF  | Form Feed（`\f`）         |
| 13  | 0D   | CR  | Carriage Return（`\r`）   |
| 14  | 0E   | SO  | Shift Out               |
| 15  | 0F   | SI  | Shift In                |
| 16  | 10   | DLE | Data Link Escape        |
| 17  | 11   | DC1 | Device Control 1 (XON)  |
| 18  | 12   | DC2 | Device Control 2        |
| 19  | 13   | DC3 | Device Control 3 (XOFF) |
| 20  | 14   | DC4 | Device Control 4        |
| 21  | 15   | NAK | Negative Acknowledge    |
| 22  | 16   | SYN | Synchronous Idle        |
| 23  | 17   | ETB | End of Block            |
| 24  | 18   | CAN | Cancel                  |
| 25  | 19   | EM  | End of Medium           |
| 26  | 1A   | SUB | Substitute              |
| 27  | 1B   | ESC | Escape                  |
| 28  | 1C   | FS  | File Separator          |
| 29  | 1D   | GS  | Group Separator         |
| 30  | 1E   | RS  | Record Separator        |
| 31  | 1F   | US  | Unit Separator          |
| 32  | 20   | SP  | Space（空格）               |
| 127 | 7F   | DEL | Delete                  |

### 可打印字符(32-126)
| 十进制 | 字符  | 十进制 | 字符  | 十进制 | 字符  | 十进制 | 字符  | 十进制 | 字符  | 十进制 | 字符  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 32  | SP  | 48  | 0   | 64  | @   | 80  | P   | 96  | `   | 112 | p   |
| 33  | !   | 49  | 1   | 65  | A   | 81  | Q   | 97  | a   | 113 | q   |
| 34  | "   | 50  | 2   | 66  | B   | 82  | R   | 98  | b   | 114 | r   |
| 35  | #   | 51  | 3   | 67  | C   | 83  | S   | 99  | c   | 115 | s   |
| 36  | $   | 52  | 4   | 68  | D   | 84  | T   | 100 | d   | 116 | t   |
| 37  | %   | 53  | 5   | 69  | E   | 85  | U   | 101 | e   | 117 | u   |
| 38  | &   | 54  | 6   | 70  | F   | 86  | V   | 102 | f   | 118 | v   |
| 39  | '   | 55  | 7   | 71  | G   | 87  | W   | 103 | g   | 119 | w   |
| 40  | (   | 56  | 8   | 72  | H   | 88  | X   | 104 | h   | 120 | x   |
| 41  | )   | 57  | 9   | 73  | I   | 89  | Y   | 105 | i   | 121 | y   |
| 42  | *   | 58  | :   | 74  | J   | 90  | Z   | 106 | j   | 122 | z   |
| 43  | +   | 59  | ;   | 75  | K   | 91  | [   | 107 | k   | 123 | {   |
| 44  | ,   | 60  | <   | 76  | L   | 92  | \|  | 108 | l   | 124 | \|  |
| 45  | -   | 61  | =   | 77  | M   | 93  | ]   | 109 | m   | 125 | }   |
| 46  | .   | 62  | >   | 78  | N   | 94  | ^   | 110 | n   | 126 | ~   |
| 47  | /   | 63  | ?   | 79  | O   | 95  | _   | 111 | o   |     |     |
