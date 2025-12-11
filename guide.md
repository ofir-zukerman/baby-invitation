# מדריך הגדרת Google Sheets + Vercel לאיסוף אישורי הגעה

## סקירה כללית

מדריך זה יעזור לך:
1. להגדיר Google Sheets לאיסוף אישורי הגעה
2. להעלות את האתר ל-Vercel (חינם!)
3. לאבטח את הקישור כך שלא יהיה חשוף ב-GitHub

```
[משתמש] → [Vercel Function] → [Google Apps Script] → [Google Sheet]
              (מאובטח)           (מקבל נתונים)         (שומר)
```

---

## חלק א': הגדרת Google Sheets

### שלב 1: יצירת Google Sheet חדש

1. היכנס ל-Google Drive שלך: https://drive.google.com
2. לחץ על **+ חדש** (New) בצד שמאל
3. בחר **Google Sheets** → **גיליון אלקטרוני ריק**
4. תן לקובץ שם, למשל: `אישורי הגעה - בריתה`

### שלב 2: פתיחת עורך הסקריפט

1. בתוך הגיליון שיצרת, לחץ על **תוספים** (Extensions) בתפריט העליון
2. בחר **Apps Script**
3. ייפתח חלון חדש עם עורך הקוד

### שלב 3: העתקת הקוד

1. **מחק את כל הקוד הקיים** בעורך

2. פתח את הקובץ `google-apps-script.js` שבתיקייה שלך

3. **העתק את כל התוכן** והדבק בעורך

4. לחץ **שמור** (Ctrl+S)

5. תן לפרויקט שם: `RSVP Handler`

### שלב 4: הגדרת הטבלה

1. בעורך, וודא שהפונקציה `setupSheet` נבחרה בתפריט הנפתח

2. לחץ על **הפעל** (Run) - ▶️

3. אשר הרשאות כשתתבקש:
   - לחץ **Review permissions**
   - בחר את חשבון ה-Google שלך
   - לחץ **Advanced** → **Go to RSVP Handler (unsafe)**
   - לחץ **Allow**

4. חזור לטבלה - העמודות נוצרו!

### שלב 5: פריסת הסקריפט

1. בעורך Apps Script, לחץ **Deploy** → **New deployment**

2. ליד "Select type", לחץ ⚙️ ובחר **Web app**

3. מלא:
   - **Description**: `RSVP Handler`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` ⚠️ חשוב!

4. לחץ **Deploy**

5. **העתק את ה-URL!** שמור אותו - תצטרך אותו בהמשך
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## חלק ב': העלאה ל-GitHub

### שלב 1: יצירת Repository

1. היכנס ל-GitHub: https://github.com

2. לחץ על **+** → **New repository**

3. מלא:
   - **Repository name**: `baby-invitation` (או כל שם שתרצה)
   - **Public** ✓ (חייב להיות public ל-Vercel חינמי)

4. לחץ **Create repository**

### שלב 2: העלאת הקבצים

בטרמינל, בתיקיית הפרויקט:

```bash
cd /Users/ofirzukerman/Desktop/inventation-website

git init
git add .
git commit -m "Initial commit - baby invitation website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/baby-invitation.git
git push -u origin main
```

החלף `YOUR_USERNAME` בשם המשתמש שלך ב-GitHub.

---

## חלק ג': הגדרת Vercel

### שלב 1: יצירת חשבון Vercel

1. היכנס ל: https://vercel.com

2. לחץ **Sign Up**

3. בחר **Continue with GitHub** (מומלץ - יקל על החיבור)

### שלב 2: ייבוא הפרויקט

1. בדף הבית של Vercel, לחץ **Add New...** → **Project**

2. מצא את ה-repository שיצרת (`baby-invitation`)

3. לחץ **Import**

### שלב 3: הגדרת Environment Variable (חשוב!)

לפני הפריסה, צריך להוסיף את הקישור של Google Script:

1. בדף ה-Import, פתח את **Environment Variables**

2. הוסף משתנה חדש:
   - **Name**: `GOOGLE_SCRIPT_URL`
   - **Value**: הדבק את ה-URL של Google Script שהעתקת קודם

3. לחץ **Add**

### שלב 4: פריסה

1. לחץ **Deploy**

2. חכה כדקה עד שהפריסה תסתיים

3. תקבל URL לאתר שלך, למשל:
   ```
   https://baby-invitation-xxx.vercel.app
   ```

---

## חלק ד': בדיקה סופית

1. פתח את ה-URL של האתר שקיבלת מ-Vercel

2. מלא את הטופס עם פרטי בדיקה

3. לחץ **שלח**

4. חזור ל-Google Sheet - אמורה להופיע שורה חדשה!

---

## פתרון בעיות

### הטופס לא נשלח
- וודא שה-Environment Variable נכון ב-Vercel
- בדוק ב-Google Apps Script ש-"Who has access" מוגדר ל-"Anyone"

### שגיאת 500
- בדוק את ה-logs ב-Vercel: Project → Functions → View Logs

### עדכון האתר
אחרי כל שינוי בקוד:
```bash
git add .
git commit -m "Update description"
git push
```
Vercel יפרוס אוטומטית!

---

## Domain מותאם אישית (אופציונלי)

אם יש לך דומיין משלך:

1. ב-Vercel, לך ל-Project → Settings → Domains

2. הוסף את הדומיין שלך

3. עקוב אחרי ההוראות להגדרת DNS

---

## טיפים

1. **סיכום אישורי הגעה**: ב-Google Apps Script, הרץ את הפונקציה `getSummary`

2. **התראות**: ב-Google Sheets, הגדר התראות: Tools → Notification rules

3. **שיתוף**: שתף את הטבלה עם בני משפחה שיעזרו לעקוב

---

## סיימת! 🎉

האתר שלך מאובטח ומוכן לשימוש.
שתף את ה-URL עם המוזמנים!
