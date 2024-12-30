import React, { useState, useEffect } from 'react';
import styles from '../blacklistpage/BlackListPage.module.css';

function BlacklistManager() {
  const [users, setUsers] = useState([]); // 사용자 목록 상태

  useEffect(() => {
    // TODO: 사용자 데이터를 API에서 가져오는 로직 구현
    setUsers([
      { id: 1, name: "김가가", isBlocked: true, imageUrl: '/path/to/image1.jpg' },
      { id: 2, name: "박나나", isBlocked: true, imageUrl: '/path/to/image2.jpg' },
      { id: 3, name: "이다다", isBlocked: true, imageUrl: '/path/to/image3.jpg' },
      { id: 4, name: "최라라", isBlocked: true, imageUrl: '/path/to/image4.jpg' }
    ]);
  }, []);

  // 사용자 차단 해제 처리 함수
  const handleUnblock = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isBlocked: false } : user
    ));
    // TODO: 서버에 차단 해제 요청 보내기
  };

  return (
    <div>
        <div className={styles.userList}>
        <h3 className={styles.title}>블랙리스트 </h3>
            {users.map(user => (
          <div key={user.id} className={styles.user}>
            <img src={'/assets/image/profile_img.png'} className={styles.profileImage} alt="Profile" />
            <span className={styles.userName}>{user.name}</span>
            <button
              onClick={() => handleUnblock(user.id)}
              className={styles.unblockButton}
              disabled={!user.isBlocked}>
              차단 해제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlacklistManager;
