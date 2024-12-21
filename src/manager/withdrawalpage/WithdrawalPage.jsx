import React, { useState } from 'react';
import styles from './WithdrawalPage.module.css'; // 스타일 파일 경로에 주의하세요.
import { useNavigate } from 'react-router-dom';

const Withdrawal = () => {
    const [reason, setReason] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

    const navigate = useNavigate();

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    const handleAgreementChange = (event) => {
        setIsAgreed(event.target.checked);
    };

    const handleBackClick = () => {
        navigate('/settings');
    };

    const finishWithdrawal = () => {
        navigate('/login')
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.backButton} onClick={handleBackClick}>◀</div>
                <h1>탈퇴</h1>
                <div className={styles.headerSpace}></div>
            </header>
            <main className={styles.content}>
                <div>
                    <div className={styles.alertBox}>
                        <img src="/assets/image/unhappy.png" alt="sad" />
                    </div>
                    <div className={styles.alertBoxContent}>
                        <div>
                            <p>1개월 동안 0개 매치를 진행하며 월 평균 0원을 벌었어요</p>
                        </div>
                        <div>
                            <p>지금 탈퇴하면 김정섭 매니저님 덕에 즐거운 매치를 경험한 0명의 플래버들을 더 이상 만날 수 없어요</p>
                        </div>
                    </div>
                </div>
                <div className={styles.instructions}>
                    <p>탈퇴하기 전 확인해 주세요</p>
                    <ul>
                        <li>탈퇴 신청이 완료되면 웹에서 바로 로그아웃 돼요.</li>
                        <li>탈퇴가 완료되면, 지금까지 진행한 매치, 리뷰, 정산 내역을 확인할 수 없으며, 계약도 자동으로 종료돼요.</li>
                        <li>가입정보는 30일 후 모두 파기되며 복구할 수 없어요</li>
                        <li>탈퇴한 날로부터 30일 동안 재가입 할 수 없어요</li>
                        <li>연동된 플랩풋볼 계정은 탈퇴되지 않아요. 탈퇴를 원하실 경우 플랩풋볼 웹사이트에서 직접 탈퇴해 주세요</li>
                    </ul>
                </div>
                <div className={styles.agreement}>
                    <input
                        type="checkbox"
                        id="agreement"
                        checked={isAgreed}
                        onChange={handleAgreementChange}
                        className={styles.checkbox}
                    />
                    <label htmlFor="agreement">모두 확인하였으며, 이에 동의합니다.</label>
                </div>
                <select className={styles.reasonDropdown} value={reason} onChange={handleReasonChange}>
                    <option value="">탈퇴 사유를 선택해 주세요</option>
                    <option value="marketing">개인 사유로 매니저 활동을 더 이상 할 수 없어요</option>
                    <option value="no-benefit">매니저 활동이 만족스럽지 않아요</option>
                    <option value="no-usage">진행할 수 있는 매치가 없어요</option>
                    <option value="other">직접 입력</option>
                </select>
                <button className={styles.submitButton} disabled={!isAgreed} onClick={finishWithdrawal}>계속하기</button>
            </main>
        </div>
    );
};

export default Withdrawal;
