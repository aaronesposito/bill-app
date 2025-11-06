

            <ReactModal 
                isOpen={modalOpen}
                preventScroll={true}
                shouldCloseOnEsc={false}
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
                contentLabel="Delete Confirmation" 
                overlayClassName={styles.modalOverlay}
                className={styles.modalStyle}
            >
                {!hasBills?(
                    <>
                    <p>Are you sure?</p>
                    <div className={styles.modalButtons}>
                        <button id={styles.confirm} value={true} className='good-button' type='button' onClick={handleConfirmation}>CONFIRM</button>
                        <button id={styles.cancel} className='bad-button' type='button' onClick={()=>setModalOpen(false)}>CANCEL</button>
                    </div>
                    </>
                ):(
                    <>
                    <p>Cannot delete a bank that has associated bills</p>
                    <div className={styles.modalButtons}>
                    <button id={styles.cancel} className='bad-button' type='button' onClick={handleModalClose}>CANCEL</button>
                    </div>
                    </>
                )}
                
            </ReactModal>



            <ReactModal 
                isOpen={modalOpen}
                preventScroll={true}
                shouldCloseOnEsc={false}
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
                contentLabel="Delete Confirmation" 
                overlayClassName={styles.modalOverlay}
                className={styles.modalStyle}
            >

                <p>Are you sure?</p>
                <div className={styles.modalButtons}>
                    <button value={true} id={styles.confirm} className='good-button' type='button' onClick={handleConfirmation}>CONFIRM</button>
                    <button value={false}id={styles.cancel} className='bad-button' type='button' onClick={handleConfirmation}>CANCEL</button>
                </div>

            </ReactModal>