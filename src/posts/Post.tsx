import React, { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FaBookmark, FaHeart } from "react-icons/fa";
import {
  ChangeFileButton,
  ChangeFileInput,
  DeletePostButton,
  EditPostButton,
  EditTextArea,
  Payload,
  PostDate,
  PostFooter,
  TagWrapper,
  UserProfileNoPhoto,
  UserProfilePhoto,
  UserWrapper,
  Username,
  PostWrapper,
  LikesCount,
  PostControls,
  FooterControls,
  PostContents,
} from "./Post.styled";
// import { useMutation, useQueryClient } from "react-query";
import { IPost } from "../type/post";
import moment from "moment-timezone";
import { MdAddAPhoto, MdOutlineModeEdit } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";
import { IoCameraReverseSharp, IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Photo } from "../common/form/Form.styled";
import {
  DeletePostIcon,
  DeletePostImg,
  PostImg,
} from "../common/post/Post.styled";
import { Tag } from "../common/common.styled";

// [TODO]
// - [x] tags 등록 추가
// - [ ] 0시간 전 등 글 작성 시간 추가
// - [ ] 각 개인별 like 여부 관리
// - [ ] likes cnt 관리
// - [ ] 서버 상태 즉시 반영
// - [x] 기존 tweet docs명 변경, 데이터 새로 관리
// - [x] Delete, Edit -> Icon으로 변경하기
// - [ ] 글 클릭시 크게 보기 추가
// - Post 로직 편하게 수정하기 -
// - [x] Add Photo -> 카메라 아이콘, 미리보기 추가!

export default function Post({
  postId,
  userName,
  userId,
  userImg,
  content,
  createdAt,
  postImg,
  tags,
  bookmarkedBy,
  likedBy,
}: IPost) {
  const user = auth.currentUser;
  const userTimeZone = "Asia/Seoul";
  const localTime = moment.utc(createdAt).tz(userTimeZone);
  const formattedDate12Hour = localTime.format("h:mm A · MMM D, YYYY");
  const [edit, setEdit] = useState(false);
  const [editPost, setEditPost] = useState(content);
  const [file, setFile] = useState<File | null>(null);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHeartClick, setIsHeartClick] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  // const queryClient = useQueryClient();

  if (!user) return;

  useEffect(() => {
    setOriginalPhoto(postImg || null);
  }, [postImg]);

  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this Post?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "posts", postId));

      if (postImg) {
        const photoRef = ref(storage, `posts/${user.uid}/${postId}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditPost(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    const maxSize = 1024 * 768;

    if (files && files.length === 1 && files[0].size <= maxSize) {
      const newFile = files[0];
      setFile(newFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setOriginalPhoto(dataURL);
      };
      reader.readAsDataURL(newFile);
    } else {
      alert("Please upload a picture smaller than 1 MB.");
      setFile(null);
    }
  };

  const onEdit = async () => {
    setEdit(true);
    if (!edit) return;

    try {
      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}/${postId}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        setOriginalPhoto(url);
        await updateDoc(doc(db, "posts", postId), {
          postImg: url,
        });
      }

      console.log(editPost.length);

      if (editPost.length > 500) {
        alert("Please keep your message under 500 characters.");
        return;
      }

      if (editPost.length < 2) {
        alert("Please write your message more than 2 characters.");
        return;
      }

      await updateDoc(doc(db, "posts", postId), {
        content: editPost,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setEdit(false);
    }
  };

  const onDeletePostImg = async () => {
    try {
      if (confirm("Are you sure you want to delete this photo?")) {
        if (file) {
          setFile(null);
          setOriginalPhoto(null);
          return;
        }

        if (postImg) {
          const photoRef = ref(storage, `posts/${user.uid}/${postId}`);
          await deleteObject(photoRef);
          await updateDoc(doc(db, "posts", postId), {
            postImg: deleteField(),
          });
          setOriginalPhoto(null);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClickHeart = () => {
    // like true면 false로 변환, cnt -= 1, show 하트 애니메이션
    // like false면 true로 변환 cnt += 1
    // setIsHeartClick((prevLike) => {
    //   const newLike = !prevLike;
    //   onClickHeart(newLike);
    //   return newLike;
    // });
    // toggleLike();
    // setIsHeartClick((prevLike) => !prevLike);
    // onClickHeart(!isHeartClick);
  };

  const handleClickBookmark = async () => {
    // toast 알림 넣기
    // setIsBookmark((prev) => !prev);
  };

  return (
    <>
      <PostWrapper>
        <UserWrapper>
          {userImg ? (
            <UserProfilePhoto src={userImg} alt="user-profile-image" />
          ) : (
            <UserProfileNoPhoto />
          )}

          <Username>{userName}</Username>
          {user?.uid === userId ? (
            <PostControls>
              <div>
                {edit && (
                  <>
                    <ChangeFileButton
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {originalPhoto ? (
                        <IoCameraReverseSharp
                          aria-label="Change a photo"
                          size={25}
                        />
                      ) : (
                        <MdAddAPhoto aria-label="Add a photo" size={25} />
                      )}
                    </ChangeFileButton>
                    <ChangeFileInput
                      ref={fileInputRef}
                      onChange={onFileChange}
                      id="file"
                      accept="image/*"
                      type="file"
                    />
                  </>
                )}
              </div>
              <EditPostButton onClick={onEdit}>
                {edit ? (
                  <FaRegCheckCircle
                    color="var(--success)"
                    aria-label="Fininsh editing"
                    size={25}
                  />
                ) : (
                  <MdOutlineModeEdit aria-label="Start editing" size={22} />
                )}
              </EditPostButton>
              <DeletePostButton onClick={onDelete}>
                <IoClose aria-label="Delete" size={22} />
              </DeletePostButton>
            </PostControls>
          ) : null}
        </UserWrapper>
        <PostContents>
          {edit ? (
            <EditTextArea
              rows={10}
              maxLength={500}
              onChange={onPostChange}
              value={editPost}
            />
          ) : (
            <Payload>{content}</Payload>
          )}
          {edit ? (
            <>
              <DeletePostImg onClick={onDeletePostImg}>
                {originalPhoto && <Photo src={originalPhoto} />}
                <DeletePostIcon>
                  <RiDeleteBin6Line size={30} />
                </DeletePostIcon>
              </DeletePostImg>
            </>
          ) : (
            <PostImg>{originalPhoto && <Photo src={originalPhoto} />}</PostImg>
          )}

          {tags.length >= 1 && (
            <TagWrapper>
              {tags.length >= 1 &&
                tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
            </TagWrapper>
          )}
          <PostFooter>
            <PostDate>{formattedDate12Hour}</PostDate>
            <FooterControls>
              <LikesCount>
                <FaHeart
                  size={18}
                  color={isHeartClick ? "#5eead4" : "grey"}
                  onClick={handleClickHeart}
                />
                <p>200</p>
              </LikesCount>
              <FaBookmark
                size={18}
                color={isBookmark ? "#292b2a" : "gray"}
                onClick={handleClickBookmark}
              />
            </FooterControls>
          </PostFooter>
        </PostContents>
      </PostWrapper>
    </>
  );
}
