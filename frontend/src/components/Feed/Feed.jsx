import { useEffect, useState } from 'react';
import styles from './Feed.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import dog from '../../assets/dog.jpg';
import axios from 'axios';

const BASE_URL = `http://k9e203.p.ssafy.io`;

function Feed(data) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUrl = location.pathname;
    const state = data.state;

    const [user, setUser] = useState(null);
    const [comment, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const accessToken = sessionStorage.getItem('accessToken');

    const getComment = () => {
        axios
            .get(`${BASE_URL}/api/v1/feeds/${state.id}/comments?page=1`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                console.log(response);
                setComments(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        axios
            .get(`${BASE_URL}/api/v1/members`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        if (currentUrl != '/') {
            getComment();
        }
    }, []);

    const gotoDetailComment = () => {
        if (currentUrl == '/') {
            navigate(`/detailcomment/${state.id}`, { state });
        }
    };
    const gotoDetailFeed = () => {
        navigate(`/detailfeed/${state.id}`, { state });
    };

    const gotoEdit = () => {
        navigate(`/updatereview/${state.id}`, { state });
    };

    const formatK = (count) => {
        if (count >= 100000) {
            return (count / 1000000).toFixed(1) + '백만';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + '천';
        } else {
            return count;
        }
    };
    const formatT = (c) => {
        console.log(c);
        console.log(new Date());
        console.log(state.createdAt);
        if (c / 60 < 1) {
            return (c & 60).toFixed(0) + '초전';
        } else if (c / 60 >= 1 && c / 60 / 60 < 1) {
            return (c / 60).toFixed(0) + '분전';
        } else if (c / 60 / 60 > 1) {
            return (c / 60 / 60).toFixed(0) + '시간전 ';
        }
    };
    const formatEmail = (t) => {
        const s = t.indexOf('@');
        return t.substring(0, s);
    };
    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            axios
                .post(
                    `${BASE_URL}/api/v1/feeds/${state.id}/comments`,
                    { content: newComment },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                )
                .then(() => {
                    getComment();
                })
                .catch((error) => {
                    console.error(error);
                });

            setNewComment(''); // 댓글 추가 후 새 댓글 상태 초기화
        }
    };

    const activeEnter = (e) => {
        if (e.key === 'Enter') {
            handleAddComment();
        }
    };

    // const handleDeleteComment = (commentIndex) => {
    //     const commentToDelete = comments[commentIndex];
    //     if (commentToDelete.name === user.id) {
    //         const updatedComments = [...comments];
    //         updatedComments.splice(commentIndex, 1);
    //         setComments(updatedComments);
    //     }
    // };
    return (
        <div>
            {state.length != 0 ? (
                <div className={styles.container}>
                    {/* 게시글 주인 정보 */}
                    <div className={styles.nameContainer}>
                        <img src={state.writer.profileImageUrl} className={styles.profileimage} />
                        <div className={styles.namebox}>
                            <div className={styles.name}>{state.writer.nickname}</div>
                            <div className={styles.id}>{formatEmail(state.writer.email)}</div>
                        </div>
                    </div>

                    {/* 게시글 이미지 */}
                    <img src={state.thumbnailUrl} className={styles.imageContainer} onClick={gotoDetailFeed} />

                    {/* 게시글 좋아요, 댓글, 이어가기 정보 */}
                    <div className={styles.tagContainer}>
                        <div className={styles.tagitem}>
                            <div className={styles.tagitemicon}>
                                {state.isLiked ? (
                                    <FavoriteOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
                                ) : (
                                    <FavoriteBorderOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
                                )}
                            </div>
                            <div>{formatK(state.likeCount)}</div>
                        </div>
                        <div className={styles.tagitem}>
                            <div className={styles.tagitemicon}>
                                <SmsOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
                            </div>
                            <div>{formatK(state.commentCount)}</div>
                        </div>
                        <div className={styles.tagitem}>
                            <div className={styles.tagitemicon}>
                                <ShareOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
                            </div>
                            <div>{formatK(state.shareCount)}</div>
                        </div>

                        {/* 수정버튼 */}

                        {currentUrl == '/' ? (
                            <></>
                        ) : (
                            <>
                                {state.length != 0 && user != null && user.email == state.writer.email ? (
                                    <EditOutlinedIcon className={styles.editbtn} onClick={gotoEdit} />
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </div>

                    {/* 게시글 본문 */}
                    <div className={styles.contentContainer}>
                        <div className={styles.name}>{state.writer.nickname}</div>
                        <div className={styles.content}>{state.review}</div>
                    </div>

                    {/* 게시글 해시태그 */}
                    <div className={styles.hashTagContainer}>
                        {state.length != 0 &&
                            state.hashTags.map((v, i) => (
                                <div key={i} className={styles.hash}>
                                    <div>{v.content}</div>
                                </div>
                            ))}
                    </div>

                    {/* 게시글 시간 정보 */}
                    <div>{formatT(new Date() - state.createdAt)}</div>

                    {/* 게시글 댓글 */}
                    {currentUrl != '/' && comment.length != 0 && (
                        <div className={styles.floatBottom}>
                            {comment.map((v, i) => (
                                <div key={i} className={styles.commentContainer}>
                                    <img src={v.writer.profileImageUrl} className={styles.commentImage} />
                                    <div className={styles.commentbox}>
                                        <div className={styles.commentInfo}>
                                            <div className={styles.name}>{v.writer.nickname}</div>
                                            <div className={styles.time}>{formatT(new Date() - v.createdAt)}</div>
                                        </div>
                                        <div className={styles.comment}>{v.content}</div>
                                    </div>
                                    {/* {user.id == v.name ? <CloseOutlinedIcon onClick={() => handleDeleteComment(i)} /> : ''} */}
                                </div>
                            ))}
                        </div>
                    )}

                    {user && (
                        <div className={currentUrl == '/' ? styles.commentContainer : styles.commentContainerFix}>
                            <img src={user.profileImageUrl} className={styles.commentImage} />
                            <input
                                type="text"
                                className={styles.commentInput}
                                placeholder="댓글 달기..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onClick={gotoDetailComment}
                                onKeyDown={(e) => activeEnter(e)}
                            />
                            {newComment.length != 0 && (
                                <button onClick={handleAddComment} className={styles.commentBtn}>
                                    추가
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
//     return (
//         <div className={styles.container}>
//             {/* 게시글 주인 정보 */}
//             <div className={styles.nameContainer}>
//                 <img src={state.profileimage} className={styles.profileimage} />
//                 <div className={styles.namebox}>
//                     <div className={styles.name}>{state.name}</div>
//                     <div className={styles.id}>{state.id}</div>
//                 </div>
//             </div>

//             {/* 게시글 이미지 */}
//             <img src={state.image} className={styles.imageContainer} onClick={gotoDetailFeed} />

//             {/* 게시글 좋아요, 댓글, 이어가기 정보 */}
//             <div className={styles.tagContainer}>
//                 <div className={styles.tagitem}>
//                     <div>
//                         {state.isLiked ? (
//                             <FavoriteOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
//                         ) : (
//                             <FavoriteBorderOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
//                         )}
//                     </div>
//                     <div>{formatK(state.likes)}</div>
//                 </div>
//                 <div className={styles.tagitem}>
//                     <div>
//                         <SmsOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
//                     </div>
//                     <div>{formatK(state.comment)}</div>
//                 </div>
//                 <div className={styles.tagitem}>
//                     <div>
//                         <ShareOutlinedIcon style={{ width: '4vw', height: '4vw' }} />
//                     </div>
//                     <div>{formatK(state.share)}</div>
//                 </div>
//             </div>

//             {/* 게시글 본문 */}
//             <div className={styles.contentContainer}>
//                 <div className={styles.name}>{state.name}</div>
//                 <div className={styles.content}>{state.content}</div>
//             </div>

//             {/* 게시글 해시태그 */}
//             <div className={styles.hashTagContainer}>
//                 {state.length != 0 &&
//                     state.hash.map((v, i) => (
//                         <div key={i} className={styles.hash}>
//                             <div>{v}</div>
//                         </div>
//                     ))}
//             </div>

//             {/* 게시글 시간 정보 */}
//             <div>{formatT(new Date() - state.time)}</div>

//             {/* 게시글 댓글 */}
//             {currentUrl != '/' && state.length != 0 && (
//                 <div className={styles.floatBottom}>
//                     {state.comments.map((v, i) => (
//                         <div key={i} className={styles.commentContainer}>
//                             <img src={v.profileimage} className={styles.commentImage} />
//                             <div className={styles.commentbox}>
//                                 <div className={styles.commentInfo}>
//                                     <div className={styles.name}>{v.name}</div>
//                                     <div className={styles.time}>{formatT(new Date() - v.time)}</div>
//                                 </div>
//                                 <div className={styles.comment}>{v.comment}</div>
//                             </div>
//                             {/* {user.id == v.name ? <CloseOutlinedIcon onClick={() => handleDeleteComment(i)} /> : ''} */}
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {user && (
//                 <div className={currentUrl == '/' ? styles.commentContainer : styles.commentContainerFix}>
//                     <img src={user.profile_img} className={styles.commentImage} />
//                     <input
//                         type="text"
//                         className={styles.commentInput}
//                         placeholder="댓글 달기..."
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         onClick={gotoDetailComment}
//                         onKeyDown={(e) => activeEnter(e)}
//                     />
//                     {newComment.length != 0 && (
//                         <button onClick={handleAddComment} className={styles.commentBtn}>
//                             추가
//                         </button>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

export default Feed;