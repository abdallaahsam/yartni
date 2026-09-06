import { server, app } from './src/index.js';
import { db } from './src/db/index.js';

const BASE = 'http://localhost:5000/api';

async function runSuite() {
  console.log('🧪 Starting Yareetni comprehensive test suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('--- 1. Testing System & Health ---');
    const health = await fetch(`${BASE}/health`).then(r => r.json());
    assert(health.status === 'ok', 'GET /api/health returns ok status');

    // 2. Categories
    console.log('\n--- 2. Testing Categories & Ages ---');
    const catData = await fetch(`${BASE}/categories`).then(r => r.json());
    assert(catData.categories && catData.categories.length === 7, `GET /api/categories returns 7 categories (received: ${catData.categories?.length})`);
    assert(catData.categories[0].advice_count > 0, 'Categories include computed advice_count');

    const ageData = await fetch(`${BASE}/ages`).then(r => r.json());
    assert(ageData.ages && ageData.ages.length > 0, `GET /api/ages returns target ages list (received: ${ageData.ages?.length} ages)`);

    // 3. Authentication Flow
    console.log('\n--- 3. Testing Authentication & User Lifecycle ---');
    const uniqueNum = Date.now().toString().slice(-5);
    const registerPayload = {
      name: 'محمود عبد الرحيم',
      username: `mahmoud_${uniqueNum}`,
      email: `mahmoud_${uniqueNum}@example.com`,
      password: 'password123',
      current_age: 36
    };

    const regRes = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload)
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token, 'POST /api/auth/register creates user and returns JWT');
    const token = regData.token;

    // Login test
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: registerPayload.email, password: 'password123' })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.user.username === registerPayload.username, 'POST /api/auth/login succeeds with correct password');

    // Auth Me
    const meRes = await fetch(`${BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.id === regData.user.id, 'GET /api/auth/me returns authenticated user info');

    // 4. Create Advice Flow
    console.log('\n--- 4. Testing Advice Creation & Slugs ---');
    const newAdvice = {
      headline: `ياريتني بدأت أتعلم مهارات الذكاء الاصطناعي بدري ${uniqueNum}`,
      story: 'كنت خايف من التغيير وفاكر التكنولوجيا للمبرمجين فقط، لكن لما شفت تأثيرها عرفت قد إيه كان ممكن توفر عليا سنين شغل روتيني.',
      lesson: 'لو رجع بيا الزمن هتعلم أدوات أتمتة الأعمال والذكاء الاصطناعي ساعة كل يوم، لأنها مضاعف إنتاجية حقيقي.',
      target_age: 26,
      category_id: 2,
      is_anonymous: 0
    };

    const createRes = await fetch(`${BASE}/advices`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newAdvice)
    });
    const createData = await createRes.json();
    assert(createRes.status === 201 && createData.adviceId && createData.slug, 'POST /api/advices creates advice with slug');
    const createdAdviceId = createData.adviceId;

    // 5. Advice Details & View Count Increment
    console.log('\n--- 5. Testing Advice Details & View Count ---');
    const detailRes1 = await fetch(`${BASE}/advices/${createdAdviceId}`).then(r => r.json());
    const initialViews = detailRes1.advice.view_count;
    // Fetch again to trigger increment
    const detailRes2 = await fetch(`${BASE}/advices/${createdAdviceId}`).then(r => r.json());
    assert(detailRes2.advice.view_count === initialViews + 1, `GET /api/advices/:id increments view_count dynamically (${initialViews} -> ${detailRes2.advice.view_count})`);

    // 6. Feed Filtering & Sorting Algorithms
    console.log('\n--- 6. Testing Feed Filtering & FTS5 Search ---');
    const feedLatest = await fetch(`${BASE}/advices?sort=latest`).then(r => r.json());
    assert(feedLatest.advices && feedLatest.advices.length > 0, `Feed latest returns list (${feedLatest.advices.length} items)`);
    assert(feedLatest.advices[0].id === createdAdviceId, 'Latest advice is first in sort=latest');

    const feedTrending = await fetch(`${BASE}/advices?sort=trending`).then(r => r.json());
    assert(feedTrending.advices && feedTrending.advices.length > 0, 'Feed trending algorithm calculates scores successfully');

    const feedTop = await fetch(`${BASE}/advices?sort=top`).then(r => r.json());
    assert(feedTop.advices && feedTop.advices.length > 0, 'Feed top impact sorts by impacts successfully');

    const feedAge40 = await fetch(`${BASE}/advices?target_age=40+`).then(r => r.json());
    assert(feedAge40.advices && feedAge40.advices.length >= 2, `target_age=40+ returns advices >= 40 (found: ${feedAge40.advices.length})`);

    const feedCat = await fetch(`${BASE}/advices?category_slug=money`).then(r => r.json());
    assert(feedCat.advices.every(a => a.category_slug === 'money'), 'category_slug=money filters properly');

    // FTS5 Full-Text Search
    const searchRes = await fetch(`${BASE}/advices?q=ادخار`).then(r => r.json());
    assert(searchRes.advices && searchRes.advices.length > 0, `FTS5 search for 'ادخار' returns matches (${searchRes.advices.length} items)`);

    // 7. Social Interactions: Impact, Bookmark, Comment, Report
    console.log('\n--- 7. Testing Interactions (Impact, Bookmark, Comment, Report) ---');
    // Toggle Impact ON
    const impactRes1 = await fetch(`${BASE}/advices/${createdAdviceId}/impact`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(impactRes1.has_impacted === true && impactRes1.impact_count === 1, 'Toggle impact ON works');

    // Toggle Impact OFF
    const impactRes2 = await fetch(`${BASE}/advices/${createdAdviceId}/impact`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(impactRes2.has_impacted === false && impactRes2.impact_count === 0, 'Toggle impact OFF works');

    // Bookmark
    const bookRes1 = await fetch(`${BASE}/advices/${createdAdviceId}/bookmark`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(bookRes1.has_bookmarked === true, 'Toggle bookmark ON works');

    const myBookmarks = await fetch(`${BASE}/users/me/bookmarks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    assert(myBookmarks.bookmarks.some(b => b.id === createdAdviceId), 'GET /api/users/me/bookmarks contains bookmarked advice');

    // Comments
    const commentRes = await fetch(`${BASE}/advices/${createdAdviceId}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: 'تجربة ملهمة فعلاً وأتفق مع كل كلمة فيها!' })
    });
    const commentData = await commentRes.json();
    assert(commentRes.status === 201 && commentData.comment.content.includes('تجربة ملهمة'), 'POST /api/advices/:id/comments adds comment');

    const getComments = await fetch(`${BASE}/advices/${createdAdviceId}/comments`).then(r => r.json());
    assert(getComments.comments.length === 1 && getComments.comments[0].user_username === registerPayload.username, 'GET comments returns attached user metadata');

    // Report
    const reportRes = await fetch(`${BASE}/advices/${createdAdviceId}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'تجربة بلاغ فحص أمني للمحتوى' })
    });
    const reportData = await reportRes.json();
    assert(reportRes.status === 200, 'POST /api/advices/:id/report submits report successfully');

    // 8. User Profile & Badges
    console.log('\n--- 8. Testing User Profiles & Gamification Badges ---');
    const profileRes = await fetch(`${BASE}/users/@${registerPayload.username}`).then(r => r.json());
    assert(profileRes.user && profileRes.user.username === registerPayload.username, 'GET /api/users/@:username returns profile');
    assert(profileRes.badges && profileRes.badges.some(b => b.id === 'first_step'), 'Gamification badge "first_step" awarded for first advice');

    // Profile Update
    const updateRes = await fetch(`${BASE}/users/me/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'محمود عبد الرحيم المحدث',
        bio: 'مهتم بالتقنية وتطوير الذات ونقل التجارب.',
        current_age: 37
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200 && updateData.user.name === 'محمود عبد الرحيم المحدث', 'PUT /api/users/me/profile updates profile');

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Fatal error during test suite:', err);
    failed++;
  } finally {
    server.close(() => {
      console.log('Server shut down cleanly.');
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

runSuite();
